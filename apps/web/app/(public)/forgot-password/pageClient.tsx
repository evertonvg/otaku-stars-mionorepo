'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const forgotPasswordSchema = z.object({
	email: z.string().email('Email inválido'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPageClient() {
	const form = useForm<ForgotPasswordForm>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: '' },
	});

	const mutation = useMutation({
		mutationFn: async (data: ForgotPasswordForm) => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await res.json();
			if (!res.ok) throw new Error(result.message || 'Erro ao solicitar recuperação de senha');
			return result.message;
		},
		onSuccess: (msg) => toast.success(msg),
		onError: (err) => toast.error(err.message),
	});

	const onSubmit = (data: ForgotPasswordForm) => mutation.mutate(data);

	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			{/* Lado esquerdo com imagem/frase */}
			<div
				className="bg-cover bg-left bg-no-repeat bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center flex flex-col flex-1"
				style={{ backgroundImage: "url('/images/forgot.jpg')" }}
			>
				<div className="w-full h-full flex flex-col p-5 bg-gradient-to-br from-transparent to-black/70 items-center justify-center">
					<h1 className="text-4xl font-bold mb-4 text-center text-shadow-accent">
						Não lembra de sua senha?
					</h1>
					<p className="text-lg opacity-90 text-center text-shadow-accent">
						Forneça seu e-mail e enviaremos um link para recuperação de senha.
					</p>
				</div>
			</div>

			{/* Lado direito com formulário */}
			<div className="flex flex-1 items-center justify-center p-8 max-w-2xl">

				<div className="w-full max-w-md space-y-6">
					<h2 className="text-2xl font-semibold text-center">Recuperar Senha</h2>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<Input placeholder="seu@email.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={mutation.isPending}>
								{mutation.isPending ? 'Enviando...' : 'Enviar link de recuperação'}
							</Button>
						</form>
					</Form>
				</div>

			</div>
		</div>
	);
}
