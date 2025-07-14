import { z } from 'zod';

export const loginSchema = z.object({
	identifier: z
		.string()
		.min(3, 'Email ou usuário é obrigatório'),
	password: z
		.string()
		.min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
