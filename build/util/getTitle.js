export default function getTitle(name) {
	const parts = name.split('-');
	let word;
	for (let i = 0; i < parts.length; i++) {
		word = parts[i];
		parts[i] = word.charAt(0).toUpperCase() + word.slice(1);
	}
	return parts.join(' ');
}
