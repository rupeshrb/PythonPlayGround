import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useCodeExecution() {
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();
  
  const executeCode = async (code: string, input: string = "") => {
    setIsExecuting(true);
    setOutput((prev) => `${prev}\n$ python main.py\n`);
    
    try {
      // Format the input for better display and handling
      const formattedInput = input.replace(/\n$/, '');
      
      const response = await apiRequest("POST", "/api/execute", { code, input: formattedInput });
      const result = await response.json();
      
      if (result.error) {
        setOutput((prev) => `${prev}${result.error}\n`);
        toast({
          variant: "destructive",
          title: "Error executing code",
          description: "There was a problem running your code. Check the output for details."
        });
      } else {
        // We don't manually add input to the output as it should be reflected
        // in the program output where input is requested
        setOutput((prev) => `${prev}${result.output}`);
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput((prev) => `${prev}Error: Failed to execute code. Server error.\n`);
      toast({
        variant: "destructive",
        title: "Error executing code",
        description: "There was a problem contacting the server. Please try again."
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  const clearOutput = () => {
    setOutput("");
  };
  
  return {
    output,
    isExecuting,
    executeCode,
    clearOutput
  };
}
