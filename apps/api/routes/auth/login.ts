import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../src/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export default async function loginRoute(fastify: FastifyInstance) {
	fastify.post('/login', async (request, reply) => {
		const { emailOrUsername, password } = request.body as {
			emailOrUsername: string;
			password: string;
		};

		const user = await prisma.user.findFirst({
			where: {
				OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
			},
		});

		if (!user) {
			return reply.status(401).send({ message: 'Credenciais inválidas' });
		}

		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return reply.status(401).send({ message: 'Credenciais inválidas' });
		}

		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: '1d',
		});

		await prisma.user.update({
			where: { id: user.id },
			data: {
				refreshToken: token,
				tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 dia
			},
		});

		return reply.send({ token });
	});
}
