// routes/auth/forgotPassword.ts
import { FastifyInstance } from 'fastify';
import prisma from '../../src/lib/prisma';
import { transporter } from '../../src/utils/mailer';
import crypto from 'crypto';


export default async function forgotPasswordRoute(fastify: FastifyInstance) {
	fastify.post('/forgot-password', async (request, reply) => {
		const { email } = request.body as { email: string };

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return reply.status(200).send(); // Enviar mesmo se não existir (boa prática)
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

		await transporter.sendMail({
			to: email,
			from: `"Otaku Stars" <${process.env.MAIL_USER}>`,
			subject: 'Redefina sua senha',
			html: `<p>Clique para redefinir: <a href="${resetUrl}">${resetUrl}</a></p>`,
		});

		return reply.status(200).send();
	});
}
