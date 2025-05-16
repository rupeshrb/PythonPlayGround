import { spawn } from "child_process";
import { writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import { join } from "path";
import { tmpdir } from "os";

const TIMEOUT_MS = 10000; // 10 seconds execution timeout

interface ExecutionResult {
  output: string;
  error?: string;
}

export async function executePythonCode(code: string, input: string = ""): Promise<ExecutionResult> {
  try {
    // Create a temporary file with random name to avoid collisions
    const randomId = randomBytes(8).toString("hex");
    const tempFilePath = join(tmpdir(), `python_playground_${randomId}.py`);
    
    // Write the code to the temporary file
    await writeFile(tempFilePath, code, "utf8");
    
    // Execute the Python script
    return new Promise<ExecutionResult>((resolve) => {
      let output = "";
      let errorOutput = "";
      let hasExited = false;
      
      // Launch Python process - try python3 first, fall back to python
      const pythonProcess = spawn("python", [tempFilePath]);
      
      // Increased timeout for better handling of interactive input
      const timeoutId = setTimeout(() => {
        if (!hasExited) {
          pythonProcess.kill();
          resolve({ 
            output, 
            error: "Execution timed out after 10 seconds. If your program needs user input, make sure to provide it in the terminal below before running." 
          });
        }
      }, TIMEOUT_MS);
      
      // Handle program input - split input into lines for interactive programs
      if (input) {
        // Add a newline if it doesn't end with one
        const formattedInput = input.endsWith('\n') ? input : input + '\n';
        pythonProcess.stdin.write(formattedInput);
        pythonProcess.stdin.end();
      }
      
      // Collect program output
      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });
      
      // Collect error output
      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });
      
      // Handle process completion
      pythonProcess.on("close", (code) => {
        hasExited = true;
        clearTimeout(timeoutId);
        
        if (code !== 0) {
          resolve({ 
            output, 
            error: errorOutput || `Process exited with code ${code}` 
          });
        } else {
          resolve({ output });
        }
      });
      
      // Handle process errors
      pythonProcess.on("error", (err) => {
        hasExited = true;
        clearTimeout(timeoutId);
        resolve({ 
          output, 
          error: `Failed to execute Python: ${err.message}` 
        });
      });
    });
  } catch (error: any) {
    return {
      output: "",
      error: `Error executing Python code: ${error.message}`
    };
  }
}
