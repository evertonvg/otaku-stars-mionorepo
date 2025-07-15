// server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import appRoutes from '../routes';
import errorHandler from './plugins/errorHandler';

async function start() {
	const fastify = Fastify({ logger: true });

	if (!process.env.FRONTEND_URL) {
		throw new Error('FRONTEND_URL não está definido no .env');
	}

	await fastify.register(cors, {
		origin: process.env.FRONTEND_URL,
		credentials: true,
	});

	await fastify.register(errorHandler);
	await fastify.register(appRoutes);

	await fastify.listen({ port: 3333, host: '0.0.0.0' });

	fastify.log.info(`🚀 Servidor rodando em http://localhost:3333`);
}

start().catch((err) => {
	console.error(err);
	process.exit(1);
});
