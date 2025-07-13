import * as z from 'zod';
export const registerSchema = z
	.object({
		name: z.string().min(5, 'O nome deve ter pelo menos 5 caracteres'),
		email: z.string().email('Email inválido'),
		password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'As senhas não coincidem',
	});

export type RegisterFormInputs = z.infer<typeof registerSchema>;