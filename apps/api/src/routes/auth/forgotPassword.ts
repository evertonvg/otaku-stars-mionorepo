// routes/auth/forgotPassword.ts
import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import prisma from '../../lib/prisma';
import { sendForgotPassword } from '../../utils/sendForgotPassword';
import { Locale, t } from '../../locales';


export default async function forgotPasswordRoute(fastify: FastifyInstance) {
	fastify.post('/forgot-password', async (request, reply) => {
		const lang = (request.headers["accept-language"] as Locale) || "pt";

		const { email } = request.body as { email: string };

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return reply.status(200).send({
				message: t(lang, 'IF_EMAIL_REGISTERED_LINK_SENT'),
				code: 'IF_EMAIL_REGISTERED_LINK_SENT',
				status: 200
			}); // Enviar mesmo se não existir (boa prática)
		}

		const resetToken = crypto.randomBytes(32).toString('hex');
		const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

		await prisma.user.update({
			where: { email },
			data: {
				passwordResetToken: resetToken,
				passwordResetExpires: expiresAt,
			},
		});

		const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

		sendForgotPassword(resetUrl, email, lang);

		return reply.status(200).send({
			message: t(lang, 'IF_EMAIL_REGISTERED_LINK_SENT'),
			code: 'IF_EMAIL_REGISTERED_LINK_SENT',
			status: 200
		});
	});
}
