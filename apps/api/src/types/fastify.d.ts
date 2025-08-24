// types/fastify.d.ts
import 'fastify';

declare module 'fastify' {
	interface FastifyRequest {
		language?: string;
	}
}
