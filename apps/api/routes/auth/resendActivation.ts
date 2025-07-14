// routes/auth/resendActivation.ts

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../src/lib/prisma';
import { transporter } from '../../src/utils/mailer';
import crypto from 'crypto';

export default async function resendActivationRoute(fastify: FastifyInstance) {
	fastify.post('/resend-activation', async (request: FastifyRequest, reply: FastifyReply) => {
		const { email } = request.body as { email?: string };

		if (!email) {
			return reply.status(400).send({ message: 'E-mail é obrigatório.' });
		}

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			// Não revelar se o e-mail existe
			return reply.status(200).send({ message: 'Se o e-mail estiver cadastrado, o link será enviado.' });
		}

		if (user.isVerified) {
			return reply.status(400).send({ message: 'Conta já está ativada.' });
		}

		// Gerar novo token e expiração
		const activationToken = crypto.randomBytes(32).toString('hex');
		const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 horas

		await prisma.user.update({
			where: { id: user.id },
			data: {
				refreshToken: activationToken,
				tokenExpiresAt,
			},
		});

		const activationLink = `${process.env.FRONTEND_URL}/activate?token=${activationToken}`;

		await transporter.sendMail({
			from: `"Minha Plataforma" <${process.env.MAIL_USER}>`,
			to: email,
			subject: 'Reenvio do link de ativação',
			html: `
        <p>Olá, ${user.username}!</p>
        <p>Você solicitou o reenvio do link para ativar sua conta. Clique abaixo para ativar:</p>
        <a href="${activationLink}">Ativar conta</a>
        <p>Este link expira em 24 horas.</p>
      `,
		});

		return reply.status(200).send({ message: 'Se o e-mail estiver cadastrado, o link será enviado.' });
	});
}
