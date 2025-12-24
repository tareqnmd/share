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
    <div className="h-[600px] border border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        <Editor
            height="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={onChange}
            options={{
                readOnly,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
            }}
        />
    </div>
  );
}
