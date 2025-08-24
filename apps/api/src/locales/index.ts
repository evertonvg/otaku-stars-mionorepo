import en from "./en";
import pt from "./pt";
import es from "./es";

export const translations = { en, pt, es } as const;

export type Locale = keyof typeof translations;

export function t(lang: Locale, key: keyof typeof en) {
	const locale = translations[lang] ?? translations["pt"];
	return locale[key] ?? translations["pt"][key] ?? key;
}
