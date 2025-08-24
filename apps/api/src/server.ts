// server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import appRoutes from './routes/index';
import errorHandler from './plugins/errorHandler';
import replyPlugin from './plugins/reply';
// import languagePlugin from './plugins/language';


async function start() {
	const fastify = Fastify({ logger: true });



	if (!process.env.FRONTEND_URL) {
		throw new Error('FRONTEND_URL não está definido no .env');
	}

	await fastify.register(cors, {
		origin: process.env.FRONTEND_URL,
		credentials: true,
	});

	// await fastify.register(languagePlugin);
	await fastify.register(replyPlugin);
	await fastify.register(errorHandler);
	await fastify.register(appRoutes, { prefix: '/api' });

	await fastify.listen({ port: 3333, host: '0.0.0.0' });

	fastify.log.info(`🚀 Servidor rodando em http://localhost:3333`);

	// await fastify.ready().then(() => {
	// 	console.log(fastify.printRoutes());
	// });
}

start().catch((err) => {
	console.error(err);
	process.exit(1);
});
