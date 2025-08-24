import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../lib/prisma';

export default async function activateRoute(fastify: FastifyInstance) {
	fastify.post('/activate', async (request: FastifyRequest, reply: FastifyReply) => {
		const { token } = request.body as { token?: string };

		// 🔹 Token não fornecido
		if (!token) {
			return reply.status(400).send({ code: 'TOKEN_NOT_PROVIDED' });
		}

		// 🔹 Busca usuário pelo token
		const user = await prisma.user.findFirst({ where: { refreshToken: token } });

		// 🔹 Usuário não encontrado ou já ativado
		if (!user) {
			return reply.status(400).send({ code: 'USER_ALREADY_VERIFIED' });
		}

		// 🔹 Token expirado
		if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
			return reply.status(400).send({ code: 'TOKEN_EXPIRED' });
		}

		// 🔹 Ativa usuário
		await prisma.user.update({
			where: { id: user.id },
			data: {
				isVerified: true,
				refreshToken: null,
				tokenExpiresAt: null,
			},
		});

		// 🔹 Retorna sucesso
		return reply.status(200).send({ code: 'ACTIVATION_SUCCESS' });
	});
}
