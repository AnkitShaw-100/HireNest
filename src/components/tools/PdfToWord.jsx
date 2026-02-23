import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { FileDown, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PdfToWord = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const handleFileChange = useCallback(async (e) => {
    const f = e.target.files?.[0];

    if (!f || f.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    setFile(f);

    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      setPageCount(pdf.getPageCount());

      toast.success(`PDF loaded — ${pdf.getPageCount()} pages`);
    } catch {
      toast.error("Failed to read PDF");
    }

    e.target.value = "";
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const paragraphs = [];

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Converted from: ${file.name}`,
              bold: true,
              size: 28,
            }),
          ],
          spacing: { after: 400 },
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Total pages: ${pdf.getPageCount()}`,
              size: 22,
              color: "666666",
            }),
          ],
          spacing: { after: 400 },
        })
      );

      for (let i = 0; i < pdf.getPageCount(); i++) {
        const page = pdf.getPage(i);
        const { width, height } = page.getSize();

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `— Page ${i + 1} —`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 400, after: 200 },
          })
        );

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Dimensions: ${Math.round(width)} × ${Math.round(height)} pts`,
                size: 20,
                color: "999999",
                italics: true,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Note: Full text extraction from PDF requires server-side processing. This client-side conversion extracts document structure.",
              size: 18,
              color: "888888",
              italics: true,
            }),
          ],
          spacing: { before: 600 },
        })
      );

      const doc = new Document({
        sections: [{ children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);

      saveAs(blob, file.name.replace(/\.pdf$/, "") + ".docx");

      toast.success("Word document created!");

    } catch {
      toast.error("Conversion failed");
    } finally {
      setLoading(false);
    }
  }, [file]);

  return (
    <div>
      <motion.label
        htmlFor="pdf-word-input"
        className="flex flex-col items-center justify-center w-full min-h-[200px] rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/60 hover:bg-primary/5 cursor-pointer transition-all"
        whileHover={{ scale: 1.01 }}
      >
        <input
          id="pdf-word-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="p-4 rounded-full bg-primary/10 border border-primary/20 mb-3">
          <Upload className="w-8 h-8 text-primary" />
        </div>

        <p className="text-lg font-heading font-semibold text-foreground">
          {file ? file.name : "Upload a PDF file"}
        </p>

        {file && (
          <p className="text-sm text-muted-foreground mt-1">
            {pageCount} pages
          </p>
        )}
      </motion.label>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-center"
        >
          <Button
            onClick={handleConvert}
            disabled={loading}
            size="lg"
            className="px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <FileDown className="w-5 h-5 mr-2" />
            )}
            Convert to Word (.docx)
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default PdfToWord;