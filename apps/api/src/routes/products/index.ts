import { FastifyInstance } from 'fastify';
import getProductRoute from './getProducts';

export default async function productRoutes(fastify: FastifyInstance) {
	await fastify.register(getProductRoute);

}
