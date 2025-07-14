'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

import { loginSchema, LoginFormInputs } from '@/schema/loginSchema';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

import {
	GoogleLogo,
	FacebookLogo,
	GithubLogo,
	InstagramLogo,
	XLogo,
} from '@/components/logos/social-logos';

export default function LoginPageClient() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<LoginFormInputs>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			user: '',
			password: '',
		},
	});

	const onSubmit = async (data: LoginFormInputs) => {
		setIsLoading(true);
		const result = await signIn('credentials', {
			redirect: true,
			identifier: data.user,
			password: data.password,
		});

		setIsLoading(false);

		if (result?.error) {
			toast.error(result.error);
			return;
		}

		toast.success('Login realizado com sucesso!');
		router.push('/');
	};

	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			{/* Lado esquerdo com imagem/frase */}
			<div
				className="bg-cover bg-left bg-no-repeat bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center flex flex-col flex-1"
				style={{ backgroundImage: "url('/images/bg.png')" }}
			>
				<div className="w-full h-full flex flex-col p-5 bg-gradient-to-br from-transparent to-black/70 items-center justify-center">
					<h1 className="text-4xl font-bold mb-4 text-center text-shadow-accent">
						Bem-vindo de volta ao <br /> OTAKU STARS!
					</h1>
					<p className="text-lg opacity-90 text-center text-shadow-accent">
						Faça login para acessar sua conta e continuar aproveitando nossos serviços.
					</p>
				</div>
			</div>

			{/* Lado direito com formulário */}
			<div className="flex flex-1 items-center justify-center p-8 max-w-2xl">
				<div className="w-full max-w-md">
					<div className="rounded-full w-24 h-24 m-auto">
						<Image
							src="/images/icon.png"
							alt="Logo Otaku Stars"
							width={96}
							height={96}
							className="rounded-full object-cover w-full h-full"
						/>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Email */}
							<FormField
								control={form.control}
								name="user"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Usuário</FormLabel>
										<FormControl>
											<Input {...field} type="text" placeholder="username ou e-mail" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Senha */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Senha</FormLabel>
										<FormControl>
											<Input {...field} type="password" placeholder="******" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" disabled={isLoading} className="w-full cursor-pointer">
								{isLoading ? 'Entrando...' : 'Entrar'}
							</Button>
						</form>
					</Form>

					{/* Botões sociais (ainda não ativos) */}
					<div className="mt-8 flex justify-center space-x-4 text-muted-foreground">
						{[GoogleLogo, FacebookLogo, InstagramLogo, XLogo, GithubLogo].map((Icon, idx) => (
							<button
								key={idx}
								disabled
								className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
							>
								<Icon />
							</button>
						))}
					</div>

					{/* Link para cadastro */}
					<div className="mt-6 text-center">
						<Link href="/register">
							<Button variant="link" className="ml-4 cursor-pointer">Não tem conta? Cadastre-se</Button>
						</Link>
						<Link href="/forgot-password " >
							<Button variant="link" className="ml-4 cursor-pointer">Recuperar senha</Button>
						</Link>

					</div>
				</div>
			</div>
		</div>
	);
}
