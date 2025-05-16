import { loader } from "@monaco-editor/react";

export function setupMonaco() {
  // Setup Monaco Editor with Python syntax highlighting
  loader.init().then((monaco) => {
    // Register a custom theme if needed
    monaco.editor.defineTheme("pythonPlaygroundDark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955" },
        { token: "keyword", foreground: "569CD6" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "function", foreground: "DCDCAA" },
        { token: "variable", foreground: "9CDCFE" },
      ],
      colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "editor.lineHighlightBackground": "#2D2D2D",
        "editor.selectionBackground": "#264F78",
        "editor.selectionHighlightBackground": "#264F7880",
        "editorLineNumber.foreground": "#858585",
        "editorCursor.foreground": "#D4D4D4",
      },
    });

    // Python language completion and formatting
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: (model, position) => {
        // Simple Python keywords
        const pythonKeywords = [
          'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 
          'elif', 'else', 'except', 'False', 'finally', 'for', 'from', 'global', 
          'if', 'import', 'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 
          'pass', 'raise', 'return', 'True', 'try', 'while', 'with', 'yield'
        ];
        
        // Built-in functions
        const builtIns = [
          'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'chr', 
          'classmethod', 'compile', 'complex', 'dict', 'dir', 'divmod', 'enumerate', 
          'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 
          'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 
          'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map', 
          'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 
          'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round', 
          'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 
          'super', 'tuple', 'type', 'vars', 'zip'
        ];
        
        // Common Python snippets
        const snippets = [
          {
            label: 'def',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Function definition'
          },
          {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for ${1:item} in ${2:items}:\n\t${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop'
          },
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if ${1:condition}:\n\t${2:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If statement'
          },
          {
            label: 'ifelse',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if ${1:condition}:\n\t${2:pass}\nelse:\n\t${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If-else statement'
          },
          {
            label: 'class',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'class ${1:ClassName}:\n\tdef __init__(self, ${2:parameters}):\n\t\t${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Class definition'
          }
        ];
        
        const keywordSuggestions = pythonKeywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword
        }));
        
        const builtInSuggestions = builtIns.map(func => ({
          label: func,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: func
        }));
        
        return {
          suggestions: [
            ...snippets,
            ...keywordSuggestions,
            ...builtInSuggestions
          ]
        };
      }
    });
  });
}
