import * as z from 'zod';

export const loginSchema = z.object({
	user: z.string().min(5, 'O usuário deve ter pelo menos 5 caracteres'),
	password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;