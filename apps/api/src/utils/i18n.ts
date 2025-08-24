import fs from 'fs';
import path from 'path';

const locales = ['pt', 'en', 'es'] as const;
type Locale = typeof locales[number];

const translations: Record<Locale, Record<string, string>> = {} as any;

locales.forEach((locale) => {
	const filePath = path.join(__dirname, '..', 'locales', `${locale}.json`);
	translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
});

export function t(key: string, params: Record<string, string> = {}, locale: Locale = 'pt') {
	let text = translations[locale][key] || key;

	// Substitui {{param}} pelo valor
	Object.keys(params).forEach((param) => {
		text = text.replace(`{{${param}}}`, params[param]);
	});

	return text;
}
