import { FastifyInstance } from 'fastify';
import authRoutes from './auth';
import productRoutes from './products';

export default async function appRoutes(fastify: FastifyInstance) {
	await fastify.register(authRoutes, { prefix: '/auth' });
	await fastify.register(productRoutes, { prefix: '/products' });

	// Se quiser adicionar outras rotas, pode colocar aqui, exemplo:
	// await fastify.register(userRoutes, { prefix: '/users' });
}
