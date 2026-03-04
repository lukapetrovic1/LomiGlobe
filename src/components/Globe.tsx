import { useRef, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Memory } from "@/types/memory";

const EARTH_TEXTURE_URL = `${import.meta.env.BASE_URL}earth-texture.jpg`;

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, EARTH_TEXTURE_URL);

  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 128, 128]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.9}
        metalness={0.05}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[2.06, 64, 64]} />
      <meshStandardMaterial
        color="#88ccff"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

interface PinProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

function Pin({ memory, onClick }: PinProps) {
  const [hovered, setHovered] = useState(false);
  const position = latLngToVector3(memory.lat, memory.lng, 2.04);
  const ref = useRef<THREE.Group>(null);
  const { gl } = useThree();

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.scale.setScalar(hovered ? 1.4 : 1 + Math.sin(t * 2 + memory.lat) * 0.08);
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Pin head */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(memory); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); gl.domElement.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); gl.domElement.style.cursor = "auto"; }}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#e07040" : "#e09040"}
          emissive={hovered ? "#e07040" : "#e09040"}
          emissiveIntensity={hovered ? 1 : 0.5}
        />
      </mesh>
      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.09, 32]} />
        <meshBasicMaterial color="#e09040" transparent opacity={hovered ? 0.6 : 0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

interface GlobeProps {
  memories: Memory[];
  onPinClick: (memory: Memory) => void;
}

export default function Globe({ memories, onPinClick }: GlobeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffe8d0" />
      <pointLight position={[-5, -3, -5]} intensity={0.2} color="#4080c0" />

      <Earth />
      <Atmosphere />

      {memories.map((memory) => (
        <Pin key={memory.id} memory={memory} onClick={onPinClick} />
      ))}

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={2.5}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
        zoomSpeed={0.8}
      />
    </Canvas>
  );
}
