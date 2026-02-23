import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileImage, Scissors, FileText, FileOutput, Sparkles } from "lucide-react";

import ImageToPdf from "@/components/tools/ImageToPdf";
import PdfSplitter from "@/components/tools/PdfSplitter";
import WordToPdf from "@/components/tools/WordToPdf";
import PdfToWord from "@/components/tools/PdfToWord";

const tools = [
  { id: "img2pdf", label: "Image → PDF", icon: FileImage, component: ImageToPdf },
  { id: "split", label: "Split PDF", icon: Scissors, component: PdfSplitter },
  { id: "word2pdf", label: "Word → PDF", icon: FileText, component: WordToPdf },
  { id: "pdf2word", label: "PDF → Word", icon: FileOutput, component: PdfToWord },
];

export default function Index() {
  const [activeTool, setActiveTool] = useState("img2pdf");

  const ActiveComponent =
    tools.find((tool) => tool.id === activeTool)?.component ?? ImageToPdf;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <FileText className="w-6 h-6 text-destructive" />
            </div>

            <div>
              <h1 className="text-lg font-heading font-bold tracking-tight">
                IHate<span className="text-destructive">PDF</span>
              </h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">
                All PDF tools you need
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Free & Private</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
            Every PDF Tool You{" "}
            <span className="text-destructive glow-text">Hate</span> to Need
          </h2>

          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Convert, split, and transform your files — entirely in your browser.
            No uploads, no servers, no BS.
          </p>
        </motion.div>

        {/* Tool Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-heading font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tool.label}
              </button>
            );
          })}
        </motion.div>

        {/* Active Tool */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { title: "100% Private", desc: "Files never leave your browser" },
            { title: "No Limits", desc: "Convert unlimited files for free" },
            { title: "Instant Results", desc: "Get your files in seconds" },
          ].map((item) => (
            <div
              key={item.title}
              className="glass rounded-xl p-5 text-center glow-border"
            >
              <h3 className="font-heading font-semibold text-sm">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4">
        <p className="text-center text-xs text-muted-foreground">
          No data stored, everything runs locally
        </p>
      </footer>
    </div>
  );
}