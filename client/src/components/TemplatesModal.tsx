import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CodeTemplate } from "@/lib/templates";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  templates: CodeTemplate[];
}

export default function TemplatesModal({ 
  isOpen, 
  onClose, 
  onSelectTemplate,
  templates 
}: TemplatesModalProps) {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-medium">Code Templates</h3>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="bg-gray-900 rounded-lg p-4 hover:bg-gray-850 cursor-pointer transition-colors"
                  onClick={() => onSelectTemplate(template.id)}
                >
                  <h4 className="font-medium mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-400 mb-2">{template.description}</p>
                  <div className="bg-gray-950 p-2 rounded text-xs font-mono">
                    {template.preview.split('\n').map((line, i) => (
                      <Fragment key={i}>
                        <div className={
                          line.trim().startsWith('#') 
                            ? "text-[hsl(var(--editor-comment))]" 
                            : ""
                        }>
                          {line}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
