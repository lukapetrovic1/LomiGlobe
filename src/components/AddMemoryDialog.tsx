import { useState, useRef } from "react";
import { NewMemory } from "@/types/memory";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  DEFAULT_MEMORY_IMAGE,
  uploadMemoryImage,
  validateMemoryImage,
} from "@/lib/memory-images";

interface AddMemoryDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (memory: NewMemory) => Promise<void>;
}

export default function AddMemoryDialog({ open, onClose, onAdd }: AddMemoryDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetImageSelection = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setLat("");
    setLng("");
    resetImageSelection();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateMemoryImage(file);
    if (validationError) {
      toast.error(validationError);
      e.target.value = "";
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !lat || !lng) return;

    const parsedLat = Number.parseFloat(lat);
    const parsedLng = Number.parseFloat(lng);

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      toast.error("Latitude and longitude must be valid coordinates.");
      return;
    }

    setUploading(true);
    try {
      let imageUrl = DEFAULT_MEMORY_IMAGE;

      if (imageFile) {
        imageUrl = await uploadMemoryImage(imageFile);
      }

      await onAdd({
        title: title.trim(),
        description: description.trim(),
        date: date || new Date().toISOString().split("T")[0],
        imageUrl,
        lat: parsedLat,
        lng: parsedLng,
      });

      resetForm();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image upload failed. Please try again.";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg glass-panel rounded-xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">Add a Memory</h2>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1 block">Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Our special moment..."
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What happened that day..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 font-body resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="48.8566"
                      className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      placeholder="2.3522"
                      className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1 block">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
                  />
                </div>

                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1 block">Photo</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={resetImageSelection}
                        className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <X className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-6 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <ImagePlus className="w-8 h-8" />
                      <span className="text-sm font-body">Click to upload a photo</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-body font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {uploading ? "Uploading..." : "Add Memory"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
