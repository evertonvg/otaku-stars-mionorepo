'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { resendSchema, ResendSchema } from '@/schema/resendSchema';
import { resendActivation } from '@/lib/api/resendActivation';

export default function ResendActivation() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResendSchema>({ resolver: zodResolver(resendSchema) });

	const mutation = useMutation({
		mutationFn: resendActivation,
		onSuccess: (msg) => toast.success(msg),
		onError: (err: Error) => toast.error(err.message),
	});

	const onSubmit = (data: ResendSchema) => {
		mutation.mutate(data.email);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-6 text-center">Reenviar link de ativação</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
				<div>
					<label htmlFor="email" className="block mb-1 font-medium">
						E-mail
					</label>
					<Input
						id="email"
						type="email"
						{...register('email')}
						disabled={mutation.isPending}
						placeholder="seu@email.com"
					/>
					{errors.email && (
						<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={mutation.isPending}>
					{mutation.isPending ? 'Enviando...' : 'Enviar link'}
				</Button>
			</form>
		</div>
	);
}
