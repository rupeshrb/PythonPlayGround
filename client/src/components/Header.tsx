import { motion } from "framer-motion";
import { Play, Code, FolderOpen, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onRunCode: () => void;
  onToggleHelp: () => void;
  onOpenTemplates: () => void;
  isExecuting: boolean;
}

export default function Header({ onRunCode, onToggleHelp, onOpenTemplates, isExecuting }: HeaderProps) {
  return (
    <motion.header 
      className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Code className="text-[hsl(var(--brand-primary))] h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold text-white">Python Playground</h1>
        </div>
        <div className="hidden md:flex space-x-2">
          <button 
            className="px-3 py-1 text-sm rounded-md hover:bg-gray-700 transition-colors"
            onClick={onOpenTemplates}
          >
            <FolderOpen className="h-4 w-4 inline mr-1" /> Templates
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline"
          className="inline-flex items-center px-3 py-1 rounded-md text-gray-800 dark:text-gray-200"
          onClick={onToggleHelp}
        >
          <HelpCircle className="h-4 w-4 mr-1" /> Help
        </Button>
        <Button 
          className={`inline-flex items-center px-3 py-1 rounded-md bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-secondary))] text-white text-sm transition-colors ${isExecuting ? 'animate-pulse-slow' : ''}`}
          onClick={onRunCode}
          disabled={isExecuting}
        >
          <Play className="h-4 w-4 mr-1" /> Run
        </Button>
      </div>
    </motion.header>
  );
}
