import { z } from 'zod';

export const resetPasswordSchema = z.object({
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'As senhas não coincidem',
	path: ['confirmPassword'],
});

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;