// src/plugins/reply.ts
import fp from "fastify-plugin";
import { FastifyReply } from "fastify";

declare module "fastify" {
	interface FastifyReply {
		success: (code: string, data?: any, message?: string) => FastifyReply;
		error: (
			code: string,
			status?: number,
			errors?: any,
			message?: string
		) => FastifyReply;
	}
}

export default fp(async (app) => {
	app.decorateReply("success", function (
		this: FastifyReply,
		code: string,
		data?: any,
		message?: string
	) {
		return this.code(200).send({
			success: true,
			code,
			message,
			data,
		});
	});

	app.decorateReply("error", function (
		this: FastifyReply,
		code: string,
		status = 400,
		errors?: any,
		message?: string
	) {
		return this.code(status).send({
			success: false,
			code,
			message,
			errors,
		});
	});
});
