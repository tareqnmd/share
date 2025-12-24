'use client';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useCallback, useRef } from 'react';

interface CodeEditorProps {
	code: string;
	language: string;
	onChange?: (value: string | undefined) => void;
	readOnly?: boolean;
}

function EditorLoader() {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full bg-neutral-900 gap-4">
			<div className="relative w-10 h-10">
				<div className="absolute inset-0 rounded-full border-2 border-neutral-700" />
				<div className="absolute inset-0 rounded-full border-2 border-t-primary-500 animate-spin" />
			</div>
			<div className="text-neutral-400 text-sm">Loading editor...</div>
		</div>
	);
}

export default function CodeEditor({
	code,
	language,
	onChange,
	readOnly = false,
}: CodeEditorProps) {
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

	const handleEditorMount: OnMount = useCallback(
		(editor) => {
			editorRef.current = editor;

			if (!readOnly) {
				editor.focus();
			}
		},
		[readOnly]
	);

	const handleChange = useCallback(
		(value: string | undefined) => {
			if (onChange) {
				onChange(value);
			}
		},
		[onChange]
	);

	return (
		<div className="h-[600px] border border-neutral-800 rounded-lg overflow-hidden shadow-sm transition-all duration-200 focus-within:border-neutral-700 focus-within:ring-1 focus-within:ring-neutral-700/50">
			<Editor
				height="100%"
				language={language}
				value={code}
				theme="vs-dark"
				onChange={handleChange}
				onMount={handleEditorMount}
				loading={<EditorLoader />}
				options={{
					readOnly,
					minimap: { enabled: false },
					fontSize: 14,
					fontFamily:
						"var(--font-jetbrains-mono), 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
					scrollBeyondLastLine: false,
					automaticLayout: true,
					padding: { top: 16, bottom: 16 },
					smoothScrolling: true,
					cursorSmoothCaretAnimation: 'on',
					cursorBlinking: 'smooth',
					links: false,
					folding: true,
					lineNumbers: 'on',
					lineNumbersMinChars: 4,
					renderLineHighlight: 'line',
					wordWrap: 'on',
					renderWhitespace: 'none',
					quickSuggestions: false,
					suggestOnTriggerCharacters: false,
					acceptSuggestionOnEnter: 'off',
					tabCompletion: 'off',
					wordBasedSuggestions: 'off',
					accessibilitySupport: 'auto',
					ariaLabel: readOnly ? 'Code viewer (read-only)' : 'Code editor',
				}}
			/>
		</div>
	);
}
