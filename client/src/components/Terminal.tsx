import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, PanelBottom, Square, ArrowUpCircle } from "lucide-react";

interface TerminalProps {
  output: string;
  input: string;
  onInputChange: (input: string) => void;
  onInputSubmit?: (input: string) => void;
  onClear: () => void;
  onStop?: () => void;
  isExecuting?: boolean;
}

export default function Terminal({
  output,
  input,
  onInputChange,
  onInputSubmit,
  onClear,
  onStop,
  isExecuting = false,
}: TerminalProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus the input field when the terminal is clicked
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmitInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onInputSubmit && input.trim()) {
      e.preventDefault();
      onInputSubmit(input);
      onInputChange(""); // Clear the input after submission
    }
  };

  return (
    <motion.div
      className="flex-1 min-w-0 flex flex-col bg-[hsl(var(--terminal-bg))] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      onClick={handleTerminalClick}
    >
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between h-[42px]">
        <div className="flex items-center">
          <span className="text-sm font-medium">Terminal</span>
          {isExecuting && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-700 text-white rounded-md animate-pulse">
              Running
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isExecuting && onStop && (
            <button
              className="text-red-400 hover:text-red-300 p-1"
              title="Stop Execution"
              onClick={onStop}
            >
              <Square className="h-4 w-4" />
            </button>
          )}
          <button
            className="text-gray-400 hover:text-white p-1"
            title="Clear Terminal"
            onClick={onClear}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            className="text-gray-400 hover:text-white p-1"
            title="Toggle Terminal"
          >
            <PanelBottom className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={outputRef}
        className="flex-grow overflow-auto p-3 font-mono text-sm text-[hsl(var(--terminal-text))]"
      >
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
      <div
        className={`px-3 py-2 border-t border-gray-700 flex items-center ${
          isInputFocused ? "dark:bg-gray-800 bg-[#FFFFCC]" : ""
        }`}
      >
        <span className="text-gray-500 dark:text-gray-500 mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          className="bg-transparent flex-grow outline-none font-mono text-gray-800 dark:text-gray-200"
          placeholder={
            isExecuting ? "Enter input here..." : "Enter input here..."
          }
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleSubmitInput}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        {input.trim() && onInputSubmit && (
          <button
            className="text-blue-500 hover:text-blue-400 px-1"
            onClick={() => {
              if (input.trim() && onInputSubmit) {
                onInputSubmit(input);
                onInputChange("");
              }
            }}
            title="Send Input"
          >
            <ArrowUpCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
