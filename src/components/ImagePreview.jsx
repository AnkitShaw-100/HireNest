import { X, GripVertical } from "lucide-react";

const ImagePreview = ({ 
  file, 
  url, 
  index, 
  onRemove, 
  onDragStart, 
  onDragOver, 
  onDragEnd,
  isDragging 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`group relative glass rounded-lg overflow-hidden glow-border cursor-move ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
      draggable
      onDragStart={() => onDragStart?.(index)}
      onDragOver={(e) => onDragOver?.(e, index)}
      onDragEnd={() => onDragEnd?.()}
    >
      <div className="aspect-square relative">
        <img
          src={url}
          alt={file.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-all duration-200" />

        {/* Index badge */}
        <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <span className="text-xs font-heading font-bold text-primary-foreground">
            {index + 1}
          </span>
        </div>

        {/* Grip icon */}
        <div className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-5 h-5 text-foreground/80" />
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        >
          <X className="w-4 h-4 text-destructive-foreground" />
        </button>
      </div>

      <div className="p-2">
        <p className="text-xs text-muted-foreground truncate">{file.name}</p>
        <p className="text-[10px] text-muted-foreground/60">
          {(file.size / 1024).toFixed(0)} KB
        </p>
      </div>
    </motion.div>
  );
};

export default ImagePreview;