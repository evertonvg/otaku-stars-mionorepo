// src/routes/login.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../../schemas/login.Schema";
import { t } from "../../locales";
import type { Locale } from "../../locales";

type LoginRequestBody = {
	identifier: string;
	password: string;
};

export default async function loginRoute(fastify: FastifyInstance) {
	fastify.post(
		"/login",
		async (
			request: FastifyRequest<{ Body: LoginRequestBody }>,
			reply: FastifyReply
		) => {
			const lang = (request.headers["accept-language"] as Locale) ?? "pt";
			try {

				// ✅ Validação do body com Zod
				const parseResult = loginSchema(lang).safeParse(request.body);
				console.log(parseResult);
				if (!parseResult.success) {
					return reply.status(400).send({
						status: 400,
						code: 'INVALID_IDENTIFIER',
						message: t(lang, 'INVALID_IDENTIFIER'),
						errors: parseResult.error.format(),
					});
				}

				const { identifier, password } = parseResult.data;

				// 🔍 Busca por e-mail ou username
				const user = await prisma.user.findFirst({
					where: { OR: [{ email: identifier }, { username: identifier }] },
					include: { role: true },
				});

				if (!user) {
					return reply.status(401).send({
						success: false,
						code: "INVALID_CREDENTIALS",
						message: t(lang, "INVALID_CREDENTIALS"),
					});
				}

				if (!user.isVerified) {
					return reply.status(403).send({
						success: false,
						code: "ACCOUNT_NOT_VERIFIED",
						message: t(lang, "ACCOUNT_NOT_VERIFIED"),
					});
				}

				// 🔑 Verificação da senha
				const passwordMatch = await bcrypt.compare(password, user.password);
				if (!passwordMatch) {
					return reply.status(401).send({
						success: false,
						code: "INVALID_CREDENTIALS",
						message: t(lang, "INVALID_CREDENTIALS"),
					});
				}

				// 🪪 Geração do token JWT
				const token = jwt.sign(
					{
						sub: user.id,
						email: user.email,
						roleId: user.roleId,
					},
					process.env.JWT_SECRET!,
					{ expiresIn: "7d" }
				);

				// ✅ Resposta de sucesso
				return reply.status(200).send({
					success: true,
					code: "LOGIN_SUCCESS",
					message: t(lang, "LOGIN_SUCCESS"),
					data: {
						token,
						user: {
							id: user.id,
							username: user.username,
							email: user.email,
							role: {
								id: user.role.id,
								name: user.role.name,
							},
						},
					},
				});
			} catch (error) {
				return reply.status(500).send({
					success: false,
					code: "UNEXPECTED_ERROR",
					message: t(lang, "UNEXPECTED_ERROR"),
				});
			}
		}
	);
}
