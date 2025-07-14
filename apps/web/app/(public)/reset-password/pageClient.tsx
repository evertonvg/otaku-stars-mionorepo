'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const resetPasswordSchema = z.object({
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'As senhas não coincidem',
	path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPageClient() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get('token');

	const form = useForm<ResetPasswordForm>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { password: '', confirmPassword: '' },
	});

	const mutation = useMutation({
		mutationFn: async (data: ResetPasswordForm) => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${token}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: data.password }),
			});

			const result = await res.json();
			if (!res.ok) throw new Error(result.message || 'Erro ao redefinir senha');
			return result.message;
		},
		onSuccess: (msg) => {
			toast.success(msg);
			router.push('/login');
		},
		onError: (err) => toast.error(err.message),
	});

	const onSubmit = (data: ResetPasswordForm) => mutation.mutate(data);

	return (
		<div className="flex items-center justify-center min-h-screen px-4">
			<div className="w-full max-w-md space-y-6">
				<h2 className="text-2xl font-semibold text-center">Redefinir Senha</h2>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nova senha</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirme a nova senha</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={mutation.isPending}>
							{mutation.isPending ? 'Enviando...' : 'Redefinir Senha'}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
