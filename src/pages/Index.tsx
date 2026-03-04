import { useEffect, useState } from "react";
import Globe from "@/components/Globe";
import MemoryPanel from "@/components/MemoryPanel";
import AddMemoryDialog from "@/components/AddMemoryDialog";
import { Memory, NewMemory } from "@/types/memory";
import { Plus, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import { createMemory, deleteMemory, fetchMemories } from "@/lib/memories";

const Index = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingMemoryId, setDeletingMemoryId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadMemories = async () => {
      try {
        const storedMemories = await fetchMemories();
        if (active) {
          setMemories(storedMemories);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load memories from Supabase.";
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMemories();

    return () => {
      active = false;
    };
  }, []);

  const handleAddMemory = async (memory: NewMemory) => {
    const createdMemory = await createMemory(memory);
    setMemories((prev) => [...prev, createdMemory]);
  };

  const handleDeleteMemory = async (memory: Memory) => {
    const confirmed = window.confirm(`Remove "${memory.title}"?`);
    if (!confirmed) {
      return;
    }

    setDeletingMemoryId(memory.id);
    try {
      await deleteMemory(memory);
      setMemories((prev) => prev.filter((entry) => entry.id !== memory.id));
      setSelectedMemory((current) => (current?.id === memory.id ? null : current));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove the memory.";
      toast.error(message);
    } finally {
      setDeletingMemoryId(null);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-background">
      {/* Globe */}
      <div className="absolute inset-0">
        <Globe memories={memories} onPinClick={setSelectedMemory} />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 left-6 z-10"
      >
        <div className="glass-panel rounded-xl px-5 py-3 warm-glow">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <h1 className="font-display text-xl font-semibold text-foreground">Our World</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-body">
            {loading ? "Loading memories..." : `${memories.length} memories pinned`}
          </p>
        </div>
      </motion.div>

      {/* Add Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        onClick={() => setAddDialogOpen(true)}
        className="absolute bottom-8 right-8 z-10 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity warm-glow"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-xs text-muted-foreground font-body glass-panel rounded-full px-4 py-2"
      >
        Click a pin to see the memory · Scroll to zoom · Drag to rotate
      </motion.p>

      {/* Memory Panel */}
      <MemoryPanel
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onDelete={handleDeleteMemory}
        deleting={selectedMemory?.id === deletingMemoryId}
      />

      {/* Add Dialog */}
      <AddMemoryDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddMemory}
      />
    </div>
  );
};

export default Index;
