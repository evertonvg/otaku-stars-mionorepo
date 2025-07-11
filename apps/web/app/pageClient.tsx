'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

import Link from 'next/link';
import Image from 'next/image';

// Importe seus SVGs personalizados
import {
  GoogleLogo,
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  XLogo,
} from '@/components/logos/social-logos';

const loginSchema = z.object({
  email: z.string().min(5, 'O usuário deve ter pelo menos 5 caracteres').email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPageClient() {
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormInputs) {
    console.log('Login:', data);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Esquerda: imagem ou frase */}
      <div
        className="bg-cover bg-left bg-no-repeat bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center flex flex-col flex-1"
        style={{ backgroundImage: "url('/images/bg.png')" }}
      >
        <div className="w-full h-full flex flex-col p-5 bg-gradient-to-br from-white/50 to-black/50 items-center justify-center">
          <h1 className="text-4xl font-bold mb-4 text-center text-shadow-accent">
            Bem-vindo de volta ao <br /> OTAKU STARS!
          </h1>
          <p className="text-lg opacity-90 text-center text-shadow-accent">
            Faça login para acessar sua conta e continuar aproveitando nossos serviços.
          </p>
        </div>
      </div>

      {/* Direita: Formulário */}
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="seu@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </Form>

          {/* Botões sociais */}
          <div className="mt-8 flex justify-center space-x-4 text-muted-foreground">
            <button
              aria-label="Login com Google"
              type="button"
              disabled
              className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              <GoogleLogo />
            </button>
            <button
              aria-label="Login com Facebook"
              type="button"
              disabled
              className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              <FacebookLogo />
            </button>
            <button
              aria-label="Login com Instagram"
              type="button"
              disabled
              className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              <InstagramLogo />
            </button>
            <button
              aria-label="Login com X"
              type="button"
              disabled
              className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              <XLogo />
            </button>
            <button
              aria-label="Login com GitHub"
              type="button"
              disabled
              className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              <GithubLogo />
            </button>
          </div>

          {/* Link para cadastro */}
          <div className="mt-6 text-center">
            <Link href="/register">
              <Button variant="link">Não tem conta? Cadastre-se</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
