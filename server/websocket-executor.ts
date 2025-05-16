import { WebSocketServer, WebSocket } from 'ws';
import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';
import { randomBytes } from 'crypto';
import { join } from 'path';
import { tmpdir } from 'os';
import { Server } from 'http';

interface PythonProcess {
  stdin: any;
  stdout: any;
  process: any;
  isActive: boolean;
}

// Store active Python processes
const activePythonProcesses = new Map<string, PythonProcess>();

export function setupWebSocketServer(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws-execute' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    let sessionId = randomBytes(8).toString('hex');
    
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'start') {
          // Start a new Python process
          const { code } = data;
          const tempFilePath = join(tmpdir(), `python_playground_${sessionId}.py`);
          
          try {
            // Write the code to a temporary file
            await writeFile(tempFilePath, code, 'utf8');
            
            // Launch Python process
            const pythonProcess = spawn('python', [tempFilePath]);
            
            // Store the process
            activePythonProcesses.set(sessionId, {
              stdin: pythonProcess.stdin,
              stdout: pythonProcess.stdout,
              process: pythonProcess,
              isActive: true
            });
            
            // Handle output from the Python process
            pythonProcess.stdout.on('data', (data: Buffer) => {
              const output = data.toString();
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'output', output }));
              }
            });
            
            // Handle errors from the Python process
            pythonProcess.stderr.on('data', (data: Buffer) => {
              const error = data.toString();
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'error', error }));
              }
            });
            
            // Handle process exit
            pythonProcess.on('close', (code: number) => {
              const processInfo = activePythonProcesses.get(sessionId);
              if (processInfo) {
                processInfo.isActive = false;
              }
              
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ 
                  type: 'exit', 
                  code, 
                  message: code === 0 ? 'Program completed successfully' : `Program exited with code ${code}`
                }));
              }
            });
            
            // Send confirmation that process started
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'started', sessionId }));
            }
            
          } catch (error: any) {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ 
                type: 'error', 
                error: `Failed to start Python process: ${error.message}`
              }));
            }
          }
        } else if (data.type === 'input') {
          // Send input to an existing Python process
          const { input, id } = data;
          const process = activePythonProcesses.get(id || sessionId);
          
          if (process && process.isActive) {
            // Format input with a newline
            const formattedInput = input.endsWith('\n') ? input : input + '\n';
            process.stdin.write(formattedInput);
          } else {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ 
                type: 'error', 
                error: 'No active Python process to receive input'
              }));
            }
          }
        } else if (data.type === 'stop') {
          // Kill an existing Python process
          const process = activePythonProcesses.get(data.id || sessionId);
          
          if (process && process.isActive) {
            process.process.kill();
            process.isActive = false;
            
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'stopped' }));
            }
          }
        }
      } catch (error: any) {
        console.error('Error in WebSocket message handler:', error);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ 
            type: 'error', 
            error: `Server error: ${error.message}`
          }));
        }
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      // Clean up any processes associated with this session
      const process = activePythonProcesses.get(sessionId);
      if (process && process.isActive) {
        process.process.kill();
        activePythonProcesses.delete(sessionId);
      }
    });
  });
  
  console.log('WebSocket server for Python execution is set up');
  return wss;
}