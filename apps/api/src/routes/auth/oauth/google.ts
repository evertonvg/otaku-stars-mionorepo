import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { generateUsername } from '../../../utils/generateusername';
import { sendActivationEmail } from '../../../utils/sendActivationEmail';


type GoogleOAuthRequestBody = {
	id: string;
	email: string;
	username: string;
};

const prisma = new PrismaClient();

// POST /auth/oauth/google
export default async function (fastify: FastifyInstance) {
	fastify.post('/auth/oauth/google', async (req: FastifyRequest<{ Body: GoogleOAuthRequestBody }>, reply: FastifyReply) => {
		const { email, username, id } = req.body;

		const existingUser = await prisma.user.findUnique({ where: { email }, include: { role: true } });

		if (existingUser) {
			if (!existingUser.isVerified) {
				return reply.status(403).send({ message: 'Conta não verificada. Verifique seu e-mail.' });
			}

			return reply.send({
				id: existingUser.id,
				username: existingUser.username,
				email: existingUser.email,
				isVerified: existingUser.isVerified,
				role: {
					id: existingUser.roleId,
					name: existingUser.role?.name ?? 'user' // se necessário, relacione `role` no prisma
				}
			});
		}

		// get role padrão 
		const defaultRole = await prisma.role.findFirst({ where: { name: 'user' } });

		if (!defaultRole) {
			return reply.status(500).send({ message: 'Função padrão não encontrada' });
		}
		// 🔑 Gerar token de ativação
		const activationToken = crypto.randomBytes(32).toString('hex');
		const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 horas

		// Criar novo usuário
		const newUser = await prisma.user.create({
			data: {
				email,
				username: generateUsername(username), // função opcional para slug
				isVerified: false,
				password: '',
				googleId: id,
				refreshToken: activationToken,
				tokenExpiresAt,
				roleId: defaultRole.id,
			},
		});

		// Enviar e-mail de ativação
		await sendActivationEmail(email, username, activationToken); // você implementa essa função

		return reply.send({
			id: newUser.id,
			username: newUser.username,
			email: newUser.email,
			isVerified: false,
			role: {
				id: defaultRole.id,
				name: defaultRole.name
			}
		});
	});
}
