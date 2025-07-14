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
};

type LoginResponseSuccess = {
	message: string;
	token: string;
	user: LoginResponseUser;
};

export default async function loginRoute(fastify: FastifyInstance) {
	async function loginHandler(request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) {
		try {
			const parsed = loginSchema.safeParse(request.body);

			if (!parsed.success) {
				return reply.status(400).send({ errors: parsed.error.format() });
			}

			const { identifier, password } = parsed.data;

			const user = await prisma.user.findFirst({
				where: {
					OR: [{ email: identifier }, { username: identifier }],
				},
			});

			if (!user) {
				return reply.status(401).send({ message: 'Usuário ou senha inválidos.' });
			}

			if (!user.isVerified) {
				return reply.status(403).send({ message: 'Conta não verificada. Verifique seu e-mail.' });
			}

			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) {
				return reply.status(401).send({ message: 'Usuário ou senha inválidos.' });
			}

			const token = jwt.sign(
				{ sub: user.id, email: user.email, roleId: user.roleId },
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
					roleId: user.roleId,
				},
			};

			return reply.status(200).send(response);
		} catch (err) {
			request.log.error(err);
			return reply.status(500).send({ message: 'Erro interno no servidor.' });
		}
	}

	fastify.post('/login', loginHandler);
}
