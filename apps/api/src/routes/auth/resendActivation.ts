// routes/auth/resendActivation.ts

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import crypto from 'crypto';
import prisma from '../../lib/prisma';
import { Locale, t } from '../../locales';
import { resendActivationEmail } from '../../utils/resendActivationEmail';
import { resendPasswordSchema } from '../../schemas/resendPasswordSchema';
import { stat } from 'fs';

export default async function resendActivationRoute(fastify: FastifyInstance) {
	fastify.post('/resend-activation', async (request: FastifyRequest, reply: FastifyReply) => {
		const lang = (request.headers["accept-language"] as Locale) || "pt";

		const parseResult = resendPasswordSchema(lang).safeParse(request.body);
		if (!parseResult.success) {
			return reply.status(400).send({
				status: 400,
				code: 'INVALID_IDENTIFIER',
				message: t(lang, 'INVALID_IDENTIFIER'),
				errors: parseResult.error.format(),
			});
		}

		const { email } = parseResult.data;

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			// Não revelar se o e-mail existe
			return reply.status(200).send({
				status: 200,
				code: 'IF_EMAIL_REGISTERED_LINK_SENT',
				message: t(lang, 'IF_EMAIL_REGISTERED_LINK_SENT')
			});
		}

		if (user.isVerified) {
			return reply.status(400).send({
				status: 400,
				code: 'ACTIVATED_EMAIL_ADVISE',
				message: t(lang, 'ACTIVATED_EMAIL_ADVISE')
			});
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

		await resendActivationEmail(email, user.username, activationLink, lang);

		return reply.status(200).send({
			status: 200,
			code: 'IF_EMAIL_REGISTERED_LINK_SENT',
			message: t(lang, 'IF_EMAIL_REGISTERED_LINK_SENT')
		});
	});
}
