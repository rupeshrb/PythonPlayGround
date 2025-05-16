import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaveCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export default function SaveCodeModal({
  isOpen,
  onClose,
  code,
}: SaveCodeModalProps) {
  const [title, setTitle] = useState("");
  const [fileExtension, setFileExtension] = useState("py");
  const { toast } = useToast();

  const handleDownload = () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Title is required",
        description: "Please provide a title for your code file.",
      });
      return;
    }

    try {
      // Create a blob with the code content
      const blob = new Blob([code], { type: "text/plain" });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.${fileExtension}`;

      // Append to the document, click, and remove
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Code downloaded successfully",
        description: `Your code has been downloaded as ${title}.${fileExtension}`,
      });

      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error downloading code",
        description:
          error.message || "There was a problem downloading your code.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-gray-800 rounded-lg w-full max-w-md overflow-hidden shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center">
              <Save className="h-5 w-5 mr-2 text-blue-400" />
              Save Code File
            </h3>
            <button
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                File Name (without extension)
              </label>
              <input
                type="text"
                id="title"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a name for your code file"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="fileExtension"
                className="block text-sm font-medium mb-1"
              >
                File Extension
              </label>
              <select
                id="fileExtension"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fileExtension}
                onChange={(e) => setFileExtension(e.target.value)}
              >
                <option value="py">Python (.py)</option>
                {/* <option value="js">JavaScript (.js)</option>
                <option value="jsx">React (.jsx)</option>
                <option value="tsx">TypeScript React (.tsx)</option>
                <option value="ts">TypeScript (.ts)</option>
                <option value="html">HTML (.html)</option>
                <option value="css">CSS (.css)</option>
                <option value="json">JSON (.json)</option>
                <option value="txt">Text (.txt)</option> */}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Code Preview
              </label>
              <div className="bg-gray-900 p-3 rounded-md overflow-hidden">
                <pre className="text-xs text-gray-300 overflow-auto max-h-24 font-mono">
                  {code.slice(0, 300)}
                  {code.length > 300 && "..."}
                </pre>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 text-sm flex items-center"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                Download Code
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
