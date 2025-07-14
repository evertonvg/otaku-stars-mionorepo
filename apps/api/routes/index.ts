import { FastifyInstance } from 'fastify';
import authRoutes from './auth';

export default async function appRoutes(fastify: FastifyInstance) {
	await fastify.register(authRoutes, { prefix: '/auth' });

	// Se quiser adicionar outras rotas, pode colocar aqui, exemplo:
	// await fastify.register(userRoutes, { prefix: '/users' });
}
