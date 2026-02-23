import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, ImagePlus } from "lucide-react";

const DropZone = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );

      if (files.length) onFilesAdded(files);
    },
    [onFilesAdded]
  );

  const handleFileInput = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []).filter((f) =>
        f.type.startsWith("image/")
      );

      if (files.length) onFilesAdded(files);

      e.target.value = "";
    },
    [onFilesAdded]
  );

  return (
    <motion.label
      htmlFor="file-input"
      className={`relative flex flex-col items-center justify-center w-full min-h-[260px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
        isDragging
          ? "drop-zone-active border-primary"
          : "border-muted-foreground/30 hover:border-primary/60 hover:bg-primary/5"
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      <motion.div
        animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
          {isDragging ? (
            <ImagePlus className="w-10 h-10 text-primary" />
          ) : (
            <Upload className="w-10 h-10 text-primary" />
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-heading font-semibold text-foreground">
            {isDragging ? "Drop images here" : "Drag & drop images"}
          </p>

          <p className="text-sm text-muted-foreground mt-1">
            or{" "}
            <span className="text-primary font-medium underline underline-offset-2">
              browse files
            </span>
          </p>

          <p className="text-xs text-muted-foreground/60 mt-2">
            PNG, JPG, WEBP, GIF supported
          </p>
        </div>
      </motion.div>
    </motion.label>
  );
};

export default DropZone;