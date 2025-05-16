import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import EditorSidebar from "@/components/EditorSidebar";
import CodeEditor from "@/components/CodeEditor";
import Terminal from "@/components/Terminal";
import HelpPanel from "@/components/HelpPanel";
import Footer from "@/components/Footer";
import TemplatesModal from "@/components/TemplatesModal";
import TipsPopup from "@/components/TipsPopup";
import SaveCodeModal from "@/components/SaveCodeModal";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useWebSocketExecution } from "@/hooks/use-websocket-execution";
import { templates } from "@/lib/templates";

export default function Home() {
  // State
  const [code, setCode] = useLocalStorage<string>(
    "python-playground-code",
    "# Welcome to Python Playground! Develop By Rupesh Borse ©RBgroup\n# Start coding here or choose a template.\n\nprint('Enter your name:')\nx = input()\nprint('Hello, ' + x)",
  );
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [tipsPopupOpen, setTipsPopupOpen] = useState(false);
  const [input, setInput] = useState("");

  // Use WebSocket execution for real-time input
  const {
    output,
    isExecuting,
    executeCode,
    clearOutput,
    sendInput,
    stopExecution,
  } = useWebSocketExecution();

  // Check if we should show the tips popup
  useEffect(() => {
    const hideTips = localStorage.getItem("hideTips");
    if (hideTips !== "true") {
      // Show tips popup after a short delay
      const timer = setTimeout(() => {
        setTipsPopupOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Effects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to run code
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        executeCode(code);
      }

      // Ctrl+L to clear terminal
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        clearOutput();
      }

      // Ctrl+S to save code
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        setSaveModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, executeCode, clearOutput]);

  // Handlers
  const handleRunCode = () => {
    executeCode(code);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setCode(template.code);
    }
    setTemplateModalOpen(false);
  };

  const handleSaveCode = () => {
    setSaveModalOpen(true);
  };

  return (
    <motion.div
      className="flex flex-col h-screen bg-gray-900 text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header
        onRunCode={handleRunCode}
        onToggleHelp={() => setHelpPanelOpen(!helpPanelOpen)}
        onOpenTemplates={() => setTemplateModalOpen(true)}
        isExecuting={isExecuting}
      />

      <div className="flex-grow flex overflow-hidden">
        <EditorSidebar onSaveCode={handleSaveCode} />

        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <motion.div className="flex-1 min-w-0 flex flex-col" layout>
            <CodeEditor code={code} onChange={setCode} />
          </motion.div>

          <motion.div className="flex-1 min-w-0 flex flex-col" layout>
            <Terminal
              output={output}
              input={input}
              onInputChange={setInput}
              onInputSubmit={sendInput}
              onClear={clearOutput}
              onStop={stopExecution}
              isExecuting={isExecuting}
            />
          </motion.div>
        </div>

        <HelpPanel
          isOpen={helpPanelOpen}
          onClose={() => setHelpPanelOpen(false)}
        />
      </div>

      <Footer />

      <TemplatesModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelectTemplate={handleTemplateSelect}
        templates={templates}
      />

      <TipsPopup
        isOpen={tipsPopupOpen}
        onClose={() => setTipsPopupOpen(false)}
      />

      <SaveCodeModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        code={code}
      />
    </motion.div>
  );
}
