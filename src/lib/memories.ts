import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import type { Memory, NewMemory } from "@/types/memory";
import { deleteMemoryImage } from "@/lib/memory-images";

type MemoryRow = Tables<"memories">;
type MemoryInsert = TablesInsert<"memories">;

const mapMemoryRow = (row: MemoryRow): Memory => ({
  id: row.id,
  title: row.title,
  description: row.description,
  date: row.date,
  imageUrl: row.image_url,
  lat: row.lat,
  lng: row.lng,
});

const mapMemoryInsert = (memory: NewMemory): MemoryInsert => ({
  title: memory.title,
  description: memory.description,
  date: memory.date,
  image_url: memory.imageUrl,
  lat: memory.lat,
  lng: memory.lng,
});

export const fetchMemories = async () => {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapMemoryRow);
};

export const createMemory = async (memory: NewMemory) => {
  const { data, error } = await supabase
    .from("memories")
    .insert(mapMemoryInsert(memory))
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapMemoryRow(data);
};

export const deleteMemory = async (memory: Memory) => {
  const { error } = await supabase.from("memories").delete().eq("id", memory.id);

  if (error) {
    throw new Error(error.message);
  }

  try {
    await deleteMemoryImage(memory.imageUrl);
  } catch (error) {
    console.warn("Memory was deleted, but its image could not be removed.", error);
  }
};
