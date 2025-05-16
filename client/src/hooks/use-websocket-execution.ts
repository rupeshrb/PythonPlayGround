import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// WebSocket execution states
type ExecutionState = 'idle' | 'connecting' | 'running' | 'error' | 'completed';

export function useWebSocketExecution() {
  const [output, setOutput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [executionState, setExecutionState] = useState<ExecutionState>('idle');
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  // Create and set up WebSocket connection
  const connectSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    setExecutionState('connecting');
    
    // Use the correct protocol based on the current URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws-execute`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setExecutionState('idle');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'output':
            setOutput(prev => prev + data.output);
            break;
            
          case 'error':
            setOutput(prev => prev + data.error);
            setExecutionState('error');
            break;
            
          case 'started':
            setSessionId(data.sessionId);
            setExecutionState('running');
            break;
            
          case 'exit':
            setOutput(prev => prev + `\n${data.message}\n`);
            setExecutionState(data.code === 0 ? 'completed' : 'error');
            break;
            
          case 'stopped':
            setOutput(prev => prev + '\nProgram execution stopped.\n');
            setExecutionState('idle');
            break;
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setExecutionState('idle');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setExecutionState('error');
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Failed to connect to the execution server.'
      });
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [toast]);

  // Connect WebSocket on component mount
  useEffect(() => {
    const cleanup = connectSocket();
    
    return () => {
      if (cleanup) cleanup();
      
      // Close socket when component unmounts
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [connectSocket]);

  // Execute code via WebSocket
  const executeCode = useCallback((code: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      // Try to reconnect if socket is not open
      connectSocket();
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Reconnecting to execution server...'
      });
      return;
    }
    
    // Clear previous output and start new execution
    setOutput('\n$ python main.py\n');
    setExecutionState('running');
    
    // Send code to execute
    socketRef.current.send(JSON.stringify({
      type: 'start',
      code
    }));
  }, [connectSocket, toast]);

  // Send input to running program
  const sendInput = useCallback((input: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Cannot send input - connection lost.'
      });
      return;
    }
    
    if (executionState !== 'running' || !sessionId) {
      toast({
        variant: 'destructive',
        title: 'No Active Program',
        description: 'There is no running program to receive input.'
      });
      return;
    }
    
    // Send input to the running program
    socketRef.current.send(JSON.stringify({
      type: 'input',
      input,
      id: sessionId
    }));
    
    // Show input in output area
    setOutput(prev => prev + input + '\n');
  }, [executionState, sessionId, toast]);

  // Stop current execution
  const stopExecution = useCallback(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    
    if (executionState === 'running' && sessionId) {
      socketRef.current.send(JSON.stringify({
        type: 'stop',
        id: sessionId
      }));
    }
  }, [executionState, sessionId]);

  // Clear terminal output
  const clearOutput = useCallback(() => {
    setOutput('');
  }, []);

  return {
    output,
    isExecuting: executionState === 'running' || executionState === 'connecting',
    hasError: executionState === 'error',
    executeCode,
    sendInput,
    stopExecution,
    clearOutput
  };
}