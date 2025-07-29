// lib/schema-i18n.ts
type TranslationKeys = {
	login: {
		errors: {
			email: string;
			password: string;
		};
	};
};

export async function getSchemaTranslations(locale: string) {
	// Carrega as mensagens de forma síncrona (adequado para validação)
	const messages = (await import(`../app/_messages/${locale}.json`)).default as TranslationKeys;
	return messages.login.errors;
}