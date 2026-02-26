import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { FileDown, Loader2, Upload, Scissors } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

const PdfSplitter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [splitFrom, setSplitFrom] = useState(1);
  const [splitTo, setSplitTo] = useState(1);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];

    if (!file || file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      setPdfFile(file);

      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const count = pdf.getPageCount();

      setPageCount(count);
      setSplitFrom(1);
      setSplitTo(count);

      toast.success(`PDF loaded — ${count} pages`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load PDF. Please try another file.");
      setPdfFile(null);
    }

    e.target.value = "";
  }, []);

  const handleSplit = useCallback(async () => {
    if (!pdfFile) return;

    if (splitFrom > splitTo) {
      toast.error("'From' page must be less than or equal to 'To' page");
      return;
    }

    setLoading(true);

    try {
      const bytes = await pdfFile.arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      const pageIndices = Array.from(
        { length: splitTo - splitFrom + 1 },
        (_, i) => splitFrom - 1 + i
      );

      const pages = await newPdf.copyPages(srcPdf, pageIndices);

      pages.forEach((page) => {
        newPdf.addPage(page);
      });

      const pdfBytes = await newPdf.save();

      saveAs(
        new Blob([pdfBytes], { type: "application/pdf" }),
        `split_${splitFrom}-${splitTo}.pdf`
      );

      toast.success("PDF split successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to split PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pdfFile, splitFrom, splitTo]);

  const handleExtractAll = useCallback(async () => {
    if (!pdfFile) return;

    setLoading(true);

    try {
      const bytes = await pdfFile.arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes);

      for (let i = 0; i < srcPdf.getPageCount(); i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(srcPdf, [i]);

        newPdf.addPage(page);

        const pdfBytes = await newPdf.save();

        saveAs(
          new Blob([pdfBytes], { type: "application/pdf" }),
          `page_${i + 1}.pdf`
        );
      }

      toast.success(`Extracted ${srcPdf.getPageCount()} pages!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to extract pages. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pdfFile]);

  return (
    <div>
      {/* Upload */}
      <motion.label
        htmlFor="pdf-split-input"
        className="flex flex-col items-center justify-center w-full min-h-[200px] rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/60 hover:bg-primary/5 cursor-pointer transition-all"
        whileHover={{ scale: 1.01 }}
      >
        <input
          id="pdf-split-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="p-4 rounded-full bg-primary/10 border border-primary/20 mb-3">
          <Upload className="w-8 h-8 text-primary" />
        </div>

        <p className="text-lg font-heading font-semibold text-foreground">
          {pdfFile ? pdfFile.name : "Upload a PDF to split"}
        </p>

        {pdfFile && (
          <p className="text-sm text-muted-foreground mt-1">
            {pageCount} pages
          </p>
        )}
      </motion.label>

      {pdfFile && pageCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-6"
        >
          {/* Range selector */}
          <div className="glass rounded-xl p-5 glow-border">
            <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-primary" />
              Extract Page Range
            </h3>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">From</label>

                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={splitFrom}
                  onChange={(e) =>
                    setSplitFrom(
                      Math.max(1, Math.min(pageCount, Number(e.target.value)))
                    )
                  }
                  className="w-20 rounded-lg bg-secondary border border-border px-3 py-2 text-sm text-foreground font-heading"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">To</label>

                <input
                  type="number"
                  min={splitFrom}
                  max={pageCount}
                  value={splitTo}
                  onChange={(e) =>
                    setSplitTo(
                      Math.max(splitFrom, Math.min(pageCount, Number(e.target.value)))
                    )
                  }
                  className="w-20 rounded-lg bg-secondary border border-border px-3 py-2 text-sm text-foreground font-heading"
                />
              </div>

              <Button
                onClick={handleSplit}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <FileDown className="w-4 h-4 mr-1" />
                )}
                Extract Range
              </Button>
            </div>
          </div>

          {/* Extract all */}
          <div className="glass rounded-xl p-5 glow-border">
            <h3 className="font-heading font-semibold text-foreground mb-2">
              Extract All Pages
            </h3>

            <p className="text-sm text-muted-foreground mb-4">
              Download each page as a separate PDF file.
            </p>

            <Button
              onClick={handleExtractAll}
              disabled={loading}
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Scissors className="w-4 h-4 mr-1" />
              )}
              Split All {pageCount} Pages
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PdfSplitter;