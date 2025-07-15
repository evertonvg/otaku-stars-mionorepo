// src/plugins/errorHandler.ts
import { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default async function errorHandler(fastify: FastifyInstance) {
	fastify.setErrorHandler(async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
		request.log.error(error);

		// 🧪 Erro de validação com Zod
		if (error instanceof ZodError) {
			return reply.status(400).send({
				message: 'Erro de validação',
				errors: error.format(),
			});
		}

		// 🧠 Prisma: erro conhecido
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return reply.status(500).send({
				message: 'Erro do banco de dados (requisição conhecida)',
				code: error.code,
			});
		}

		// 🔌 Prisma: falha na conexão
		if (error instanceof Prisma.PrismaClientInitializationError) {
			return reply.status(500).send({
				message: 'Erro ao conectar ao banco de dados. Verifique sua internet.',
			});
		}

		// 💣 Prisma: erro crítico (panic)
		if (error instanceof Prisma.PrismaClientRustPanicError) {
			return reply.status(500).send({
				message: 'Erro crítico no servidor. Reinicie a aplicação.',
			});
		}

		// 🌐 Falha geral de conexão
		if ((error as any).code === 'ECONNREFUSED') {
			return reply.status(503).send({
				message: 'Servidor indisponível. Verifique sua conexão.',
			});
		}

		// 🔐 JWT: token expirado
		if (error instanceof jwt.TokenExpiredError) {
			return reply.status(401).send({
				message: 'Sessão expirada. Faça login novamente.',
			});
		}

		// 🔐 JWT: token inválido ou malformado
		if (error instanceof jwt.JsonWebTokenError) {
			return reply.status(401).send({
				message: 'Token inválido. Faça login novamente.',
			});
		}

		// 🔐 JWT: token ainda não ativo
		if (error instanceof jwt.NotBeforeError) {
			return reply.status(401).send({
				message: 'Token ainda não está ativo.',
			});
		}

		// 💥 Erro inesperado
		return reply.status(500).send({
			message: 'Erro inesperado no servidor.',
		});
	});
}
