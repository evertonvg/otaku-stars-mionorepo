'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/app/_components/server/auth-layout';

import { resetPasswordSchema, ResetPasswordForm } from '@/schema/resetPasswordSchema';
import { resetPassword } from '@/lib/api/resetPassword';

export default function ResetPasswordPageClient() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get('token');

	const form = useForm<ResetPasswordForm>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { password: '', confirmPassword: '' },
	});

	const mutation = useMutation<string, Error, ResetPasswordForm>({
		mutationFn: (data) => resetPassword(data, token ?? ''),
		onSuccess: (msg) => {
			toast.success(msg);
			router.push('/login');
		},
		onError: (err) => toast.error(err.message),
	});

	const onSubmit = (data: ResetPasswordForm) => mutation.mutate(data);

	return (
		<AuthLayout image='erase.png'>
			<AuthLayout.BodyTitle>
				<h1>Recuperar sua senha</h1>
			</AuthLayout.BodyTitle>
			<AuthLayout.BodyContent>
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
			</AuthLayout.BodyContent>
		</AuthLayout>
	);
}
