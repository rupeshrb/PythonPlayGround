import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { executePythonCode } from "./python-execution";
import { setupWebSocketServer } from "./websocket-executor";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for executing Python code (legacy, WebSocket is preferred for input)
  app.post("/api/execute", async (req, res) => {
    try {
      const { code, input } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }
      
      const result = await executePythonCode(code, input);
      return res.json(result);
    } catch (error: any) {
      console.error("Error executing code:", error);
      return res.status(500).json({ 
        error: `Failed to execute code: ${error.message || "Unknown error"}` 
      });
    }
  });

  // Save code snippet
  app.post("/api/save", async (req, res) => {
    try {
      const { title, code } = req.body;
      
      if (!title || !code) {
        return res.status(400).json({ error: "Title and code are required" });
      }
      
      const snippet = await storage.saveCodeSnippet({
        title,
        code,
        created_at: new Date()
      });
      
      return res.json(snippet);
    } catch (error: any) {
      console.error("Error saving code:", error);
      return res.status(500).json({ 
        error: `Failed to save code: ${error.message || "Unknown error"}` 
      });
    }
  });

  // Get saved code snippets
  app.get("/api/snippets", async (req, res) => {
    try {
      const snippets = await storage.getCodeSnippets();
      return res.json(snippets);
    } catch (error: any) {
      console.error("Error getting snippets:", error);
      return res.status(500).json({ 
        error: `Failed to get snippets: ${error.message || "Unknown error"}` 
      });
    }
  });

  // Get a specific code snippet
  app.get("/api/snippets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const snippet = await storage.getCodeSnippet(id);
      if (!snippet) {
        return res.status(404).json({ error: "Snippet not found" });
      }
      
      return res.json(snippet);
    } catch (error: any) {
      console.error("Error getting snippet:", error);
      return res.status(500).json({ 
        error: `Failed to get snippet: ${error.message || "Unknown error"}` 
      });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket for real-time Python execution with input
  setupWebSocketServer(httpServer);
  
  return httpServer;
}
