import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function getProductRoute(fastify: FastifyInstance) {
	fastify.get("/product", async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.status(200).send({ message: "OK" });
	});
}