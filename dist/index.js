// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  snippets;
  userIdCounter;
  snippetIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.snippets = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.snippetIdCounter = 1;
  }
  // User related operations (from the existing implementation)
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Code snippet operations
  async saveCodeSnippet(snippet) {
    const id = this.snippetIdCounter++;
    const newSnippet = { ...snippet, id };
    this.snippets.set(id, newSnippet);
    return newSnippet;
  }
  async getCodeSnippets() {
    return Array.from(this.snippets.values()).sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }
  async getCodeSnippet(id) {
    return this.snippets.get(id);
  }
  async updateCodeSnippet(id, updatedFields) {
    const snippet = this.snippets.get(id);
    if (!snippet) return void 0;
    const updatedSnippet = { ...snippet, ...updatedFields };
    this.snippets.set(id, updatedSnippet);
    return updatedSnippet;
  }
  async deleteCodeSnippet(id) {
    return this.snippets.delete(id);
  }
};
var storage = new MemStorage();

// server/python-execution.ts
import { spawn } from "child_process";
import { writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import { join } from "path";
import { tmpdir } from "os";
var TIMEOUT_MS = 1e4;
async function executePythonCode(code, input = "") {
  try {
    const randomId = randomBytes(8).toString("hex");
    const tempFilePath = join(tmpdir(), `python_playground_${randomId}.py`);
    await writeFile(tempFilePath, code, "utf8");
    return new Promise((resolve) => {
      let output = "";
      let errorOutput = "";
      let hasExited = false;
      const pythonProcess = spawn("python", [tempFilePath]);
      const timeoutId = setTimeout(() => {
        if (!hasExited) {
          pythonProcess.kill();
          resolve({
            output,
            error: "Execution timed out after 10 seconds. If your program needs user input, make sure to provide it in the terminal below before running."
          });
        }
      }, TIMEOUT_MS);
      if (input) {
        const formattedInput = input.endsWith("\n") ? input : input + "\n";
        pythonProcess.stdin.write(formattedInput);
        pythonProcess.stdin.end();
      }
      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });
      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });
      pythonProcess.on("close", (code2) => {
        hasExited = true;
        clearTimeout(timeoutId);
        if (code2 !== 0) {
          resolve({
            output,
            error: errorOutput || `Process exited with code ${code2}`
          });
        } else {
          resolve({ output });
        }
      });
      pythonProcess.on("error", (err) => {
        hasExited = true;
        clearTimeout(timeoutId);
        resolve({
          output,
          error: `Failed to execute Python: ${err.message}`
        });
      });
    });
  } catch (error) {
    return {
      output: "",
      error: `Error executing Python code: ${error.message}`
    };
  }
}

// server/websocket-executor.ts
import { WebSocketServer, WebSocket } from "ws";
import { spawn as spawn2 } from "child_process";
import { writeFile as writeFile2 } from "fs/promises";
import { randomBytes as randomBytes2 } from "crypto";
import { join as join2 } from "path";
import { tmpdir as tmpdir2 } from "os";
var activePythonProcesses = /* @__PURE__ */ new Map();
function setupWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws-execute" });
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    let sessionId = randomBytes2(8).toString("hex");
    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "start") {
          const { code } = data;
          const tempFilePath = join2(tmpdir2(), `python_playground_${sessionId}.py`);
          try {
            await writeFile2(tempFilePath, code, "utf8");
            const pythonProcess = spawn2("python", [tempFilePath]);
            activePythonProcesses.set(sessionId, {
              stdin: pythonProcess.stdin,
              stdout: pythonProcess.stdout,
              process: pythonProcess,
              isActive: true
            });
            pythonProcess.stdout.on("data", (data2) => {
              const output = data2.toString();
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "output", output }));
              }
            });
            pythonProcess.stderr.on("data", (data2) => {
              const error = data2.toString();
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "error", error }));
              }
            });
            pythonProcess.on("close", (code2) => {
              const processInfo = activePythonProcesses.get(sessionId);
              if (processInfo) {
                processInfo.isActive = false;
              }
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: "exit",
                  code: code2,
                  message: code2 === 0 ? "Program completed successfully" : `Program exited with code ${code2}`
                }));
              }
            });
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "started", sessionId }));
            }
          } catch (error) {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: "error",
                error: `Failed to start Python process: ${error.message}`
              }));
            }
          }
        } else if (data.type === "input") {
          const { input, id } = data;
          const process2 = activePythonProcesses.get(id || sessionId);
          if (process2 && process2.isActive) {
            const formattedInput = input.endsWith("\n") ? input : input + "\n";
            process2.stdin.write(formattedInput);
          } else {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: "error",
                error: "No active Python process to receive input"
              }));
            }
          }
        } else if (data.type === "stop") {
          const process2 = activePythonProcesses.get(data.id || sessionId);
          if (process2 && process2.isActive) {
            process2.process.kill();
            process2.isActive = false;
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "stopped" }));
            }
          }
        }
      } catch (error) {
        console.error("Error in WebSocket message handler:", error);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "error",
            error: `Server error: ${error.message}`
          }));
        }
      }
    });
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      const process2 = activePythonProcesses.get(sessionId);
      if (process2 && process2.isActive) {
        process2.process.kill();
        activePythonProcesses.delete(sessionId);
      }
    });
  });
  console.log("WebSocket server for Python execution is set up");
  return wss;
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/execute", async (req, res) => {
    try {
      const { code, input } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }
      const result = await executePythonCode(code, input);
      return res.json(result);
    } catch (error) {
      console.error("Error executing code:", error);
      return res.status(500).json({
        error: `Failed to execute code: ${error.message || "Unknown error"}`
      });
    }
  });
  app2.post("/api/save", async (req, res) => {
    try {
      const { title, code } = req.body;
      if (!title || !code) {
        return res.status(400).json({ error: "Title and code are required" });
      }
      const snippet = await storage.saveCodeSnippet({
        title,
        code,
        created_at: /* @__PURE__ */ new Date()
      });
      return res.json(snippet);
    } catch (error) {
      console.error("Error saving code:", error);
      return res.status(500).json({
        error: `Failed to save code: ${error.message || "Unknown error"}`
      });
    }
  });
  app2.get("/api/snippets", async (req, res) => {
    try {
      const snippets = await storage.getCodeSnippets();
      return res.json(snippets);
    } catch (error) {
      console.error("Error getting snippets:", error);
      return res.status(500).json({
        error: `Failed to get snippets: ${error.message || "Unknown error"}`
      });
    }
  });
  app2.get("/api/snippets/:id", async (req, res) => {
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
    } catch (error) {
      console.error("Error getting snippet:", error);
      return res.status(500).json({
        error: `Failed to get snippet: ${error.message || "Unknown error"}`
      });
    }
  });
  const httpServer = createServer(app2);
  setupWebSocketServer(httpServer);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
