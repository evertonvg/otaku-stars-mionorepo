import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { registerSchema } from '../../schemas/registerSchema';
import prisma from '../../lib/prisma';
import { sendActivationEmail } from '../../utils/sendActivationEmail';
import { Locale, t } from '../../locales'; // 🔹 Import do sistema de traduções
import { stat } from 'fs';

export default async function registerRoute(fastify: FastifyInstance) {
	fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
		const lang = (request.headers["accept-language"] as Locale) ?? "pt";

		// 🔹 Parse do body usando Zod
		const parseResult = registerSchema(lang).safeParse(request.body);
		if (!parseResult.success) {
			return reply.status(400).send({
				status: 400,
				code: 'INVALID_IDENTIFIER',
				message: t(lang, 'INVALID_IDENTIFIER'),
				errors: parseResult.error.format(),
			});
		}

		const { username, email, password } = parseResult.data;

		// 🔹 Verifica usuário existente
		const existingUser = await prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		});

		if (existingUser) {
			return reply.status(400).send({
				status: 400,
				code: 'USER_ALREADY_EXISTS',
				message: t(lang, 'USER_ALREADY_EXISTS'),
			});
		}

		// 🔹 Hash da senha
		const hashedPassword = await bcrypt.hash(password, 10);

		// 🔹 Busca role padrão
		const defaultRole = await prisma.role.findFirst({ where: { name: 'user' } });
		if (!defaultRole) {
			return reply.status(500).send({
				status: 500,
				code: 'DEFAULT_ROLE_NOT_FOUND',
				message: t(lang, 'DEFAULT_ROLE_NOT_FOUND'),
			});
		}

		// 🔹 Gera token de ativação
		const activationToken = crypto.randomBytes(32).toString('hex');
		const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

		// 🔹 Cria usuário
		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				roleId: defaultRole.id,
				refreshToken: activationToken,
				tokenExpiresAt,
			},
		});

		// 🔹 Envia e-mail de ativação
		const activationLink = `${process.env.FRONTEND_URL}/activate?token=${activationToken}`;
		await sendActivationEmail(email, username, activationLink, lang);

		// 🔹 Retorna sucesso com mensagem traduzida
		return reply.status(201).send({
			status: 201,
			code: 'REGISTER_SUCCESS',
			message: t(lang, 'REGISTER_SUCCESS'),
		});
	});
}
