import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../lib/prisma';
import { Locale, t } from '../../locales';

export default async function activateRoute(fastify: FastifyInstance) {
	fastify.post('/activate', async (request: FastifyRequest, reply: FastifyReply) => {
		const lang = (request.headers["accept-language"] as Locale) || "pt";

		const token = (request.query as { token?: string })?.token
			|| (request.body as { token?: string })?.token;


		// 🔹 Token não fornecido
		if (!token) {
			return reply.status(400).send({
				token,
				status: 400,
				message: t(lang, 'TOKEN_NOT_PROVIDED'),
				code: 'TOKEN_NOT_PROVIDED'
			});
		}

		// 🔹 Busca usuário pelo token
		const user = await prisma.user.findFirst({ where: { refreshToken: token } });

		// 🔹 Usuário não encontrado ou já ativado
		if (!user) {
			return reply.status(400).send({
				token,
				status: 400,
				message: t(lang, 'USER_ALREADY_VERIFIED'),
				code: 'USER_ALREADY_VERIFIED'
			});
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
		return reply.status(200).send({
			status: 200,
			message: t(lang, 'ACTIVATION_SUCCESS'),
			code: 'ACTIVATION_SUCCESS'
		});
	});
}
