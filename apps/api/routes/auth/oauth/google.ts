import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /auth/oauth/google
export default async function (fastify: FastifyInstance) {
	fastify.post('/auth/oauth/google', async (req, reply) => {
		const { email, name } = req.body;

		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (existingUser) {
			if (!existingUser.isVerified) {
				return reply.status(403).send({ message: 'Conta não verificada. Verifique seu e-mail.' });
			}

			return reply.send({
				id: existingUser.id,
				username: existingUser.username,
				email: existingUser.email,
				role: existingUser.role,
				isVerified: existingUser.isVerified,
			});
		}

		// Criar novo usuário
		const newUser = await prisma.user.create({
			data: {
				email,
				username: generateUsername(name), // função opcional para slug
				name,
				isVerified: false,
				role: { connect: { id: 2 } }, // ou o ID padrão para novos usuários
			},
			include: { role: true },
		});

		// Enviar e-mail de ativação
		await sendActivationEmail(newUser.email, newUser.id); // você implementa essa função

		return reply.send({
			id: newUser.id,
			username: newUser.username,
			email: newUser.email,
			role: newUser.role,
			isVerified: false,
		});
	});
