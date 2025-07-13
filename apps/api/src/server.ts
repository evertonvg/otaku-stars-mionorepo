import Fastify from 'fastify'
import cors from '@fastify/cors';
import prisma from './lib/prisma'

import registerRoute from '../routes/auth/register';
import loginRoute from '../routes/auth/login';

async function start() {
	const fastify = Fastify({ logger: true });

	await fastify.register(cors, {
		origin: process.env.FRONTEND_URL,
		credentials: true,
	});

	// suas rotas
	fastify.register(registerRoute);
	fastify.register(loginRoute);

	await fastify.listen({ port: 3333 });
	console.log('Servidor rodando');
}

start().catch(err => {
	console.error(err);
	process.exit(1);
});
