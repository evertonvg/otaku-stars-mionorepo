import * as z from 'zod';
export const resendSchema = z.object({
	email: z.string().email('E-mail inválido'),
});

export type ResendSchema = z.infer<typeof resendSchema>;