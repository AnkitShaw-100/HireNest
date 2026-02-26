import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { FileUp, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Document, Packer, convertInchesToTwip } from "docx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";

const WordToPdf = () => {
  const [docFile, setDocFile] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please select a Word document (.docx or .doc)");
      return;
    }

    setDocFile(file);
    toast.success(`Document loaded: ${file.name}`);
    e.target.value = "";
  }, []);

  const handleClear = useCallback(() => {
    setDocFile(null);
  }, []);



  const handleConvert = useCallback(async () => {
    if (!docFile) {
      toast.error("Please select a document first");
      return;
    }

    setLoading(true);

    try {
      const arrayBuffer = await docFile.arrayBuffer();
      const pdf = new jsPDF();

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      const lineHeight = 7;
      const fontSize = 11;

      pdf.setFontSize(fontSize);

      // Extract text from the document (basic implementation)
      const uint8Array = new Uint8Array(arrayBuffer);
      const text = new TextDecoder().decode(uint8Array);

      // Filter and split text into lines
      const lines = text
        .split(/\n/)
        .filter((line) => line.trim())
        .slice(0, 100); // Limit to 100 lines for demo

      let yPosition = margin;

      for (const line of lines) {
        const wrappedText = pdf.splitTextToSize(line, maxWidth);

        for (const wrappedLine of wrappedText) {
          if (yPosition + lineHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.text(wrappedLine, margin, yPosition);
          yPosition += lineHeight;
        }
      }

      pdf.save(`${docFile.name.split(".")[0]}.pdf`);
      toast.success("Document converted to PDF!");
      setDocFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Conversion failed. Please try another file.");
    } finally {
      setLoading(false);
    }
  }, [docFile]);

  return (
    <div>
      {/* Upload */}
      <motion.label
        htmlFor="doc-input"
        className="flex flex-col items-center justify-center w-full min-h-[200px] rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/60 hover:bg-primary/5 cursor-pointer transition-all"
        whileHover={{ scale: 1.01 }}
      >
        <input
          id="doc-input"
          type="file"
          accept=".docx,.doc"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="p-4 rounded-full bg-primary/10 border border-primary/20 mb-3">
          <FileUp className="w-8 h-8 text-primary" />
        </div>

        <p className="text-lg font-heading font-semibold text-foreground">
          {docFile ? docFile.name : "Upload a Word document"}
        </p>

        {!docFile && (
          <p className="text-sm text-muted-foreground mt-1">(.docx or .doc)</p>
        )}
      </motion.label>

      {docFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass rounded-xl p-6 glow-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-heading font-semibold text-foreground">
                  Document ready to convert
                </p>
                <p className="text-sm text-muted-foreground">{docFile.name}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              Change
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleConvert}
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Converting..." : "Convert to PDF"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WordToPdf;