// src/routes/login.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../src/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../../src/schemas/login.Schema';

type LoginRequestBody = {
	identifier: string;
	password: string;
};

type LoginResponseUser = {
	id: number;
	username: string;
	email: string;
	roleId: number;
	role: {
		id: number
		name: string
	},
};

type LoginResponseSuccess = {
	message: string;
	token: string;
	user: LoginResponseUser;
	roleId: number;
	role: {
		id: number
		name: string
	},
};

export default async function loginRoute(fastify: FastifyInstance) {
	fastify.post(
		'/login',
		async (request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) => {
			const parsed = loginSchema.parse(request.body);
			const { identifier, password } = parsed;

			// 🔍 Busca por e-mail ou username
			const user = await prisma.user.findFirst({
				where: {
					OR: [{ email: identifier }, { username: identifier }],
				},
				include: {
					role: true,
				},
			});

			if (!user) {
				return reply.status(401).send({ message: 'Usuário ou senha inválidos.' });
			}

			if (!user.isVerified) {
				return reply.status(403).send({ message: 'Conta não verificada. Verifique seu e-mail.' });
			}

			// 🔑 Verificação da senha
			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch || password == '') {
				return reply.status(401).send({ message: 'Usuário ou senha inválidos.' });
			}

			// 🪪 Geração do token JWT
			const token = jwt.sign(
				{
					sub: user.id,
					email: user.email,
					roleId: user.roleId,
				},
				process.env.JWT_SECRET!,
				{ expiresIn: '7d' }
			);

			const response: LoginResponseSuccess = {
				message: 'Login realizado com sucesso.',
				token,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					role: {
						id: user.role.id,
						name: user.role.name,
					},
					roleId: user.roleId
				},
				roleId: user.roleId,
				role: {
					id: user.role.id,
					name: user.role.name,
				},
			};

			return reply.status(200).send(response);
		}
	);
}
