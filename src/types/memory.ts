export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

export type NewMemory = Omit<Memory, "id">;
