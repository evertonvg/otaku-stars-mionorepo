import Fastify from 'fastify';
import cors from '@fastify/cors';
import appRoutes from '../routes';

async function start() {
	const fastify = Fastify({ logger: true });

	await fastify.register(cors, {
		origin: process.env.FRONTEND_URL,
		credentials: true,
	});

	await fastify.register(appRoutes);

	await fastify.listen({ port: 3333 });
	console.log('Servidor rodando em http://localhost:3333');
}

start().catch((err) => {
	console.error(err);
	process.exit(1);
});
