'use client';
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ code, language, onChange, readOnly = false }: CodeEditorProps) {
  return (
    <div className="h-[600px] border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden shadow-sm">
        <Editor
            height="100%"
            language={language}
            value={code} // Use value for controlled component, defaultValue for uncontrolled.
            theme="vs-dark"
            onChange={onChange}
            options={{
                readOnly,
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
        />
    </div>
  );
}

