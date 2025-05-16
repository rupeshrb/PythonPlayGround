import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Maximize, Code } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [autoSuggestions, setAutoSuggestions] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleAutoSuggestions = () => {
    setAutoSuggestions(!autoSuggestions);
    // Store the suggestion preference
    window.localStorage.setItem(
      "autoSuggestions",
      (!autoSuggestions).toString(),
    );

    // Update monaco editor settings if possible
    try {
      //@ts-ignore
      if (window.monaco && window.editor) {
        //@ts-ignore
        window.editor.updateOptions({
          quickSuggestions: autoSuggestions ? false : true,
          suggestOnTriggerCharacters: autoSuggestions ? false : true,
        });
      }
    } catch (err) {
      console.log("Could not update editor settings");
    }
  };

  return (
    <motion.footer
      className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-400 flex items-center justify-between"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div>Python 3.11</div>
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
          <span>Ready</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className={`hover:text-white flex items-center ${autoSuggestions ? "text-blue-400" : "text-gray-400"}`}
          title={
            autoSuggestions
              ? "Disable Auto-suggestions"
              : "Enable Auto-suggestions"
          }
          onClick={toggleAutoSuggestions}
        >
          <Code className="h-4 w-4 mr-1" />
          <span className="text-xs">Auto</span>
        </button>
        <button
          className="hover:text-white"
          title="Change Theme"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
        <button
          className="hover:text-white"
          title="Full Screen"
          onClick={toggleFullScreen}
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>
    </motion.footer>
  );
}
