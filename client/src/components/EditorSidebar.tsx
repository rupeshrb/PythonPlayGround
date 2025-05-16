import { useState } from "react";
import { motion } from "framer-motion";
import { Save, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditorSidebarProps {
  onSaveCode: () => void;
}

export default function EditorSidebar({ onSaveCode }: EditorSidebarProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const openGeeksForGeeks = () => {
    window.open('https://www.geeksforgeeks.org/python-programming-language-tutorial/', '_blank');
  };

  return (
    <motion.div 
      className="hidden md:block bg-gray-800 w-14 border-r border-gray-700 flex-shrink-0"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center py-4 space-y-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`text-gray-400 hover:text-white p-2 ${activeItem === 'saved' ? 'text-white bg-gray-700 rounded' : ''}`}
                onClick={() => {
                  setActiveItem('saved');
                  onSaveCode();
                }}
              >
                <Save className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Save Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`text-gray-400 hover:text-white p-2 ${activeItem === 'learning' ? 'text-white bg-gray-700 rounded' : ''}`}
                onClick={() => {
                  setActiveItem('learning');
                  openGeeksForGeeks();
                }}
              >
                <BookOpen className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Learning Resources</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
