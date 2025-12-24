export default function EditorLoader() {
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
