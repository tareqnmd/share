export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export function formatDateShort(dateString: string): string {
	return new Date(dateString).toLocaleDateString();
}
