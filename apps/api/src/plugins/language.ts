// import { FastifyPluginAsync } from 'fastify';

// const supportedLanguages = ['pt', 'en', 'es'] as const;
// type SupportedLanguage = (typeof supportedLanguages)[number];

// const languagePlugin: FastifyPluginAsync = async (fastify) => {
// 	fastify.addHook('preHandler', async (request) => {
// 		const langHeader = request.headers['accept-language'] as string | undefined;
// 		const lang = langHeader?.split('-')[0].toLowerCase() as SupportedLanguage | undefined;

// 		// Se não for suportado, usar padrão 'pt'
// 		request.language = supportedLanguages.includes(lang as SupportedLanguage)
// 			? (lang as SupportedLanguage)
// 			: 'pt';
// 	});
// };

// export default languagePlugin;
