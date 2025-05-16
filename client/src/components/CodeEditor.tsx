import { useEffect, useState, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { setupMonaco } from "@/lib/monaco";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    if (isEditorReady) {
      setupMonaco();
      
      // Make editor globally accessible for auto-suggestion toggle
      //@ts-ignore
      window.editor = editorRef.current;
      
      // Apply dark theme immediately
      editorRef.current?.updateOptions({
        theme: "pythonPlaygroundDark"
      });
    }
  }, [isEditorReady]);
  
  // Fix the text color in dark mode when theme changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        theme: isDarkTheme ? "pythonPlaygroundDark" : "light"
      });
    }
  }, [theme, isDarkTheme]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    // Force dark theme application on mount
    editor.updateOptions({
      theme: "pythonPlaygroundDark"
    });
    
    // Update monaco editor's model to refresh syntax highlighting
    const model = editor.getModel();
    if (model) {
      const oldValue = model.getValue();
      model.setValue(oldValue);
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  return (
    <motion.div 
      className="flex-1 min-w-0 flex flex-col bg-[hsl(var(--editor-bg))] border-r border-gray-700 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between h-[42px]">
        <div className="flex items-center">
          <span className="text-sm font-medium">main.py</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-400 hover:text-white p-1"
            title="Format Code"
            onClick={handleFormatCode}
          >
            <span className="font-mono text-xs">{ } Format</span>
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <Editor
          defaultLanguage="python"
          value={code}
          onChange={(value) => onChange(value || "")}
          theme={isDarkTheme ? "pythonPlaygroundDark" : "light"}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            formatOnPaste: true,
            formatOnType: true,
            lineNumbers: "on",
            renderLineHighlight: "all",
            automaticLayout: true,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible"
            }
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </motion.div>
  );
}
