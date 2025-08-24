// src/plugins/errorHandler.ts
import { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

export default async function errorHandler(fastify: FastifyInstance) {
	fastify.setErrorHandler(
		async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
			request.log.error(error);

			// Zod
			if (error instanceof ZodError) {
				const formatted = Object.entries(error.format()).reduce((acc, [key, value]) => {
					// value pode ser { _errors: string[] }
					acc[key] = (value as any)._errors; // array de codes
					return acc;
				}, {} as Record<string, string[]>);

				return reply.error("VALIDATION_ERROR", 400, formatted);
			}

			// Prisma: erro conhecido
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				return reply.error("PRISMA_KNOWN_ERROR", 500, { code: error.code });
			}

			// Prisma: falha na conexão
			if (error instanceof Prisma.PrismaClientInitializationError) {
				return reply.error("PRISMA_CONNECTION_ERROR", 500);
			}

			// Prisma: erro crítico
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				return reply.error("PRISMA_CRITICAL_ERROR", 500);
			}

			// Falha geral de conexão
			if ((error as any).code === "ECONNREFUSED") {
				return reply.error("CONNECTION_REFUSED", 503);
			}

			// JWT expirado
			if (error instanceof jwt.TokenExpiredError) {
				return reply.error("JWT_EXPIRED", 401);
			}

			// JWT inválido
			if (error instanceof jwt.JsonWebTokenError) {
				return reply.error("JWT_INVALID", 401);
			}

			// JWT ainda não ativo
			if (error instanceof jwt.NotBeforeError) {
				return reply.error("JWT_NOT_ACTIVE", 401);
			}

			// Qualquer outro erro inesperado
			return reply.error("UNEXPECTED_ERROR", 500, error);
		}
	);
}
