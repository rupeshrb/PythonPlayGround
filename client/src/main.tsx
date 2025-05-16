import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import App from "./App";
import "./index.css";

const ThemeWrapper = ({ children }) => {
  useEffect(() => {
    // Force theme to light by clearing any saved preference
    localStorage.setItem("theme", "light");

    // Also remove dark class if somehow still applied
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  return (
    <ThemeProvider defaultTheme="light" attribute="class" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
};

// Render the app with the theme wrapper
createRoot(document.getElementById("root")).render(
  <ThemeWrapper>
    <App />
  </ThemeWrapper>,
);
