import { useState, useEffect, useRef } from "react";
import { editor } from "monaco-editor";

export function useEditor(initialValue: string = "") {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };
  
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  };
  
  const setSelection = (startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number) => {
    if (editorRef.current) {
      editorRef.current.setSelection({
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn
      });
      editorRef.current.revealLineInCenter(startLineNumber);
    }
  };
  
  const insertSnippet = (snippet: string) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      if (selection) {
        const range = new monaco.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn
        );
        editorRef.current.executeEdits("", [{ range, text: snippet }]);
      }
    }
  };
  
  return {
    value,
    setValue,
    editorRef,
    handleEditorDidMount,
    formatCode,
    setSelection,
    insertSnippet
  };
}
