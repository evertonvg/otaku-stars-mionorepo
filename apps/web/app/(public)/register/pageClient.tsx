'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';

import { registerSchema, RegisterFormInputs } from '@/schema/registerSchema';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AuthLayout from '../../_components/server/auth-layout';

import { Eye, EyeOff } from 'lucide-react';
import { passwordStrength, generatePassword } from '@/lib/utils';
import { toast } from 'sonner';

import { registerUser } from '@/lib/api/registerUse';

export default function RegisterPageClient() {
	const [passwordVisible, setPasswordVisible] = useState(false);

	const form = useForm<RegisterFormInputs>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: () => {
			toast.success('Cadastro realizado! Verifique seu e-mail para ativar a conta.');
			form.reset();
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const handleGeneratePassword = () => {
		const password = generatePassword();
		form.setValue('password', password);
		form.setValue('confirmPassword', '');
	};

	const onSubmit = (data: RegisterFormInputs) => {
		mutation.mutate(data);
	};

	return (
		<AuthLayout image="bg2.jpg">
			<AuthLayout.BodyTitle>
				<h1 className="text-4xl font-bold mb-4 text-center text-shadow-accent">
					Crie sua conta <br /> no OTAKU STARS!
				</h1>
				<p className="text-lg opacity-90 text-center text-shadow-accent">
					Participe da comunidade e aproveite todos os benefícios.
				</p>
			</AuthLayout.BodyTitle>
			<AuthLayout.BodyContent>
				<div className="w-full max-w-md">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Nome */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Seu nome" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" {...field} placeholder="seu@email.com" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Senha */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => {
									const strength = passwordStrength(field.value);
									const strengthLabel = [
										'Muito fraca', // 0
										'Fraca',       // 1
										'Razoável',    // 2
										'Boa',         // 3
										'Forte',       // 4
										'Excelente'    // 5
									][strength] || 'Muito fraca';
									const strengthColor = [
										'text-red-600',
										'text-red-500',
										'text-yellow-500',
										'text-green-500',
										'text-green-600',
										'text-green-700'
									][strength] || 'text-red-600';

									return (
										<FormItem className="relative">
											<FormLabel>Senha</FormLabel>
											<div className="relative">
												<FormControl>
													<Input
														{...field}
														type={passwordVisible ? 'text' : 'password'}
														placeholder="******"
														onCopy={(e) => {
															e.preventDefault();
															toast.error('Copiar senha não é permitido por segurança.');
														}}
													/>
												</FormControl>
												<button
													type="button"
													onClick={() => setPasswordVisible(!passwordVisible)}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
													aria-label={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
												>
													{passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
												</button>
											</div>
											<div className={`text-sm mt-1 ${strengthColor}`}>
												Força da senha: {strengthLabel}
											</div>
											<Button
												type="button"
												variant="link"
												onClick={handleGeneratePassword}
												className="p-0 text-xs absolute right-0 top-14 cursor-pointer"
											>
												Gerar senha segura
											</Button>
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							{/* Confirmar senha */}
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirme a senha</FormLabel>
										<div className="relative">
											<FormControl>
												<Input
													{...field}
													type={passwordVisible ? 'text' : 'password'}
													placeholder="confirme sua senha"
													onCopy={(e) => {
														e.preventDefault();
														toast.error('Copiar senha não é permitido por segurança.');
													}}
												/>
											</FormControl>

										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Botão */}
							<Button type="submit" className="w-full cursor-pointer" disabled={mutation.isPending}>
								{mutation.isPending ? 'Enviando...' : 'Cadastrar'}
							</Button>
						</form>
					</Form>

					<div className="mt-6 text-center">
						<Link href="/login">
							<Button variant="link">Já tem conta? Faça login</Button>
						</Link>

					</div>
				</div>
			</AuthLayout.BodyContent>
		</AuthLayout>


	);
}
