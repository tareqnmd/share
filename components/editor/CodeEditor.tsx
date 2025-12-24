'use client';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useCallback, useRef } from 'react';
import { CodeEditorProps } from '@/types/types';
import EditorLoader from './EditorLoader';

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
