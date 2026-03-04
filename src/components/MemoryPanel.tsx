import { Memory } from "@/types/memory";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface MemoryPanelProps {
  memory: Memory | null;
  onClose: () => void;
  onDelete: (memory: Memory) => Promise<void>;
  deleting: boolean;
}

export default function MemoryPanel({ memory, onClose, onDelete, deleting }: MemoryPanelProps) {
  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-md z-50 glass-panel overflow-y-auto"
        >
          <div className="relative">
            {/* Image */}
            <div className="relative h-72 overflow-hidden">
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-card/60 backdrop-blur-sm text-foreground hover:bg-card/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 -mt-8 relative">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="font-display text-2xl font-semibold text-foreground mb-3"
              >
                {memory.title}
              </motion.h2>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-4 mb-5"
              >
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  {format(new Date(memory.date), "MMMM d, yyyy")}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  {memory.lat.toFixed(1)}°, {memory.lng.toFixed(1)}°
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="h-px bg-border mb-5"
              />

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-body text-foreground/80 leading-relaxed text-base"
              >
                {memory.description}
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                type="button"
                disabled={deleting}
                onClick={() => onDelete(memory)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {deleting ? "Removing..." : "Remove Memory"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
