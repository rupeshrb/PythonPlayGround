import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, Play, Keyboard } from "lucide-react";

interface TipsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TipsPopup({ isOpen, onClose }: TipsPopupProps) {
  const [currentTip, setCurrentTip] = useState(0);
  
  const tips = [
    {
      title: "Welcome to Python Playground!",
      content: "This is your space to write, run, and experiment with Python code. Perfect for learning and practicing your coding skills.",
      icon: <Lightbulb className="h-5 w-5 text-yellow-400" />
    },
    {
      title: "Run Your Code",
      content: "Click the Run button or use the Ctrl+Enter keyboard shortcut to execute your code and see the results in the terminal.",
      icon: <Play className="h-5 w-5 text-green-400" />
    },
    {
      title: "Keyboard Shortcuts",
      content: "Use Ctrl+Enter to run code, Ctrl+L to clear the terminal, and Alt+F to format your code neatly.",
      icon: <Keyboard className="h-5 w-5 text-blue-400" />
    }
  ];
  
  const nextTip = () => {
    if (currentTip < tips.length - 1) {
      setCurrentTip(currentTip + 1);
    } else {
      onClose();
    }
  };
  
  const prevTip = () => {
    if (currentTip > 0) {
      setCurrentTip(currentTip - 1);
    }
  };
  
  // Auto-advance tips after 10 seconds if user doesn't interact
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setTimeout(() => {
      if (currentTip < tips.length - 1) {
        setCurrentTip(currentTip + 1);
      } else {
        onClose();
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [currentTip, isOpen, onClose, tips.length]);
  
  // Don't show automatically next time
  const handleDontShowAgain = () => {
    localStorage.setItem('hideTips', 'true');
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white flex items-center">
                {tips[currentTip].icon}
                <span className="ml-2">{tips[currentTip].title}</span>
              </h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5">
              <p className="text-gray-300">{tips[currentTip].content}</p>
              
              <div className="flex items-center justify-center mt-4">
                {Array.from({ length: tips.length }).map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 ${currentTip === index ? 'bg-blue-500' : 'bg-gray-600'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-850 border-t border-gray-700">
              <button
                className="text-sm text-gray-400 hover:text-white"
                onClick={handleDontShowAgain}
              >
                Don't show again
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 text-sm rounded-md bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={prevTip}
                  disabled={currentTip === 0}
                >
                  Back
                </button>
                <button
                  className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500"
                  onClick={nextTip}
                >
                  {currentTip < tips.length - 1 ? 'Next' : 'Got it!'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}