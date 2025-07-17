export function generateUsername(name: string): string {
	return (
		name.toLowerCase().replace(/\s+/g, '_') +
		'_' +
		Math.floor(Math.random() * 10000)
	);
}