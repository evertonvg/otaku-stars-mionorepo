import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import prisma from '../../src/lib/prisma';
import { registerSchema } from '../../src/schemas/registerSchema';
import crypto from 'crypto';
import { sendActivationEmail } from '../../src/utils/sendActivationEmail';

export default async function registerRoute(fastify: FastifyInstance) {
	fastify.post('/register', async (request, reply) => {
		const parseResult = registerSchema.safeParse(request.body);

		if (!parseResult.success) {
			return reply.status(400).send({ errors: parseResult.error.format() });
		}

		const { username, email, password } = parseResult.data;

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ email }, { username }],
			},
		});

		if (existingUser) {
			return reply.status(400).send({ message: 'Email ou usuário já cadastrados' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const defaultRole = await prisma.role.findFirst({ where: { name: 'user' } });

		if (!defaultRole) {
			return reply.status(500).send({ message: 'Função padrão não encontrada' });
		}

		// 🔑 Gerar token de ativação
		const activationToken = crypto.randomBytes(32).toString('hex');
		const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 horas

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

		// 📧 Enviar e-mail de ativação
		const activationLink = `${process.env.FRONTEND_URL}/activate?token=${activationToken}`;

		sendActivationEmail(email, username, activationLink)

		return reply.status(201).send({ message: 'Cadastro realizado. Verifique seu e-mail para ativar a conta.' });
	});
}
