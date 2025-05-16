import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, Book, BookOpen, FileText, Video, ExternalLink } from "lucide-react";

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="bg-gray-800 border-l border-gray-700 flex-shrink-0 overflow-hidden h-full"
          initial={{ width: 0 }}
          animate={{ width: 320 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col h-full">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold">Help & Tips</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-[hsl(var(--brand-accent))] mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" /> Quick Tip
                </h4>
                <p className="text-sm text-gray-300">
                  Try hitting <span className="bg-gray-700 text-xs px-2 py-1 rounded">Ctrl+Enter</span> to run your code quickly!
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2 text-white">Python Basics</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-900 p-3 rounded-md">
                    <div className="font-medium mb-1">Print to console</div>
                    <code className="text-xs bg-gray-800 p-1 rounded block">print("Hello World")</code>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-md">
                    <div className="font-medium mb-1">Get user input</div>
                    <code className="text-xs bg-gray-800 p-1 rounded block">name = input("Enter your name: ")</code>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-md">
                    <div className="font-medium mb-1">For loop</div>
                    <code className="text-xs bg-gray-800 p-1 rounded block">for i in range(5):
    print(i)</code>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2 text-white">Keyboard Shortcuts</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-900 p-2 rounded-md">
                    <span className="text-gray-400">Run code:</span>
                    <span className="bg-gray-700 text-xs px-2 py-0.5 rounded">Ctrl+Enter</span>
                  </div>
                  <div className="bg-gray-900 p-2 rounded-md">
                    <span className="text-gray-400">Save:</span>
                    <span className="bg-gray-700 text-xs px-2 py-0.5 rounded">Ctrl+S</span>
                  </div>
                  <div className="bg-gray-900 p-2 rounded-md">
                    <span className="text-gray-400">Format:</span>
                    <span className="bg-gray-700 text-xs px-2 py-0.5 rounded">Alt+F</span>
                  </div>
                  <div className="bg-gray-900 p-2 rounded-md">
                    <span className="text-gray-400">Clear terminal:</span>
                    <span className="bg-gray-700 text-xs px-2 py-0.5 rounded">Ctrl+L</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-white">Learning Resources</h4>
                <div className="space-y-2 text-sm">
                  <a 
                    href="https://www.geeksforgeeks.org/python-programming-language-tutorial/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-gray-900 p-3 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <div className="font-medium flex items-center">
                      <Book className="h-4 w-4 mr-2 text-[hsl(var(--brand-accent))]" />
                      GeeksforGeeks Python Tutorial
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">A complete guide to Python for beginners</p>
                  </a>
                  <a 
                    href="https://www.geeksforgeeks.org/fundamentals-of-algorithms/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-gray-900 p-3 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <div className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-[hsl(var(--brand-accent))]" />
                      Algorithms on GeeksforGeeks
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Learn sorting, searching and more</p>
                  </a>
                  <a 
                    href="https://www.geeksforgeeks.org/python-programming-examples/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-gray-900 p-3 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <div className="font-medium flex items-center">
                      <Video className="h-4 w-4 mr-2 text-[hsl(var(--brand-accent))]" />
                      Python Programming Examples
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Practice with real coding examples</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
