import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import DropZone from "@/components/DropZone";
import ImagePreview from "@/components/ImagePreview";
import ConvertButton from "@/components/ConvertButton";
import { Button } from "@/components/ui/button";

const ImageToPdf = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleFilesAdded = useCallback((files) => {
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    toast.success(`${files.length} image${files.length > 1 ? "s" : ""} added`);
  }, []);

  const handleRemove = useCallback((index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
  }, [images]);

  const handleDragStart = useCallback((index) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  }, [draggedIndex, images]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!images.length) return;

    setLoading(true);

    try {
      const pdf = new jsPDF();

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgEl = new Image();
        imgEl.src = img.url;

        await new Promise((resolve) => {
          imgEl.onload = () => {
            const pw = pdf.internal.pageSize.getWidth();
            const ph = pdf.internal.pageSize.getHeight();

            const ratio = Math.min(pw / imgEl.width, ph / imgEl.height);
            const w = imgEl.width * ratio;
            const h = imgEl.height * ratio;

            if (i > 0) pdf.addPage();

            pdf.addImage(img.url, "JPEG", (pw - w) / 2, (ph - h) / 2, w, h);

            resolve();
          };
        });
      }

      pdf.save("images.pdf");

      toast.success("PDF created successfully!");
    } catch {
      toast.error("Conversion failed");
    } finally {
      setLoading(false);
    }
  }, [images]);

  return (
    <div>
      <DropZone onFilesAdded={handleFilesAdded} />

      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-heading font-medium text-foreground">
                {images.length} {images.length === 1 ? "image" : "images"}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag to reorder
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <AnimatePresence mode="popLayout">
              {images.map((img, i) => (
                <ImagePreview
                  key={img.url}
                  file={img.file}
                  url={img.url}
                  index={i}
                  onRemove={handleRemove}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === i}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-center">
            <ConvertButton
              disabled={false}
              loading={loading}
              count={images.length}
              onClick={handleConvert}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageToPdf;
