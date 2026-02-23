import { motion } from "framer-motion";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConvertButton = ({ disabled, loading, count, onClick }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        size="lg"
        className="w-full sm:w-auto px-8 py-6 text-base font-heading font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 disabled:opacity-40 disabled:shadow-none transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Converting...
          </>
        ) : (
          <>
            <FileDown className="w-5 h-5 mr-2" />
            Convert {count} {count === 1 ? "Image" : "Images"} to PDF
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default ConvertButton;