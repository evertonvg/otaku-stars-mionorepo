import { FastifyInstance } from 'fastify';
import registerRoute from './register';
import loginRoute from './login';
import activateRoute from './activate';
import resendActivationRoute from './resendActivation';
import forgotPasswordRoute from './forgotPassword'

export default async function authRoutes(fastify: FastifyInstance) {
	await fastify.register(registerRoute);
	await fastify.register(loginRoute);
	await fastify.register(activateRoute);
	await fastify.register(resendActivationRoute);
	await fastify.register(forgotPasswordRoute);
}
