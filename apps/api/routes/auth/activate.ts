// routes/auth/activate.ts

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../src/lib/prisma';

export default async function activateRoute(fastify: FastifyInstance) {
	fastify.post('/activate', async (request: FastifyRequest, reply: FastifyReply) => {
		const { token } = request.body as { token?: string };

		if (!token) {
			return reply.status(400).send({ message: 'Token não fornecido.' });
		}

		const user = await prisma.user.findFirst({
			where: { refreshToken: token },
		});

		if (!user) {
			return reply.status(400).send({ message: 'Token inválido.' });
		}

		if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
			return reply.status(400).send({ message: 'Token expirado. Solicite novo registro.' });
		}

		await prisma.user.update({
			where: { id: user.id },
			data: {
				isVerified: true,
				refreshToken: null,
				tokenExpiresAt: null,
			},
		});

		return reply.send({ message: 'Conta ativada com sucesso!' });
	});
}
