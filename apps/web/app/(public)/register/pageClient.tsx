/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';

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

import { Eye, EyeOff } from 'lucide-react';

import { passwordStrength } from '@/lib/utils';

const registerSchema = z
  .object({
    name: z.string().min(5, 'O nome deve ter pelo menos 5 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(14, 'Telefone inválido'), // (99) 99999-9999 tem 14 caracteres
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPageClient() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleGeneratePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()';
    const all = upper + lower + numbers + symbols;

    const getRandom = (str: string) => str[Math.floor(Math.random() * str.length)];

    let password = '';
    // Garantir pelo menos 1 de cada tipo
    password += getRandom(upper);
    password += getRandom(lower);
    password += getRandom(numbers);
    password += getRandom(symbols);

    // Completar até 14 caracteres com qualquer caractere do conjunto
    for (let i = 4; i < 14; i++) {
      password += getRandom(all);
    }

    // Embaralhar a senha para não ficar sempre na mesma ordem
    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    form.setValue('password', password);
    form.setValue('confirmPassword', ''); // limpar o confirmPassword
    setGeneratedPassword(password);
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11); // máximo 11 dígitos (2 DDD + 9)
    const match = digits.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return value;
    const [, ddd, prefix, suffix] = match;
    let formatted = '';
    if (ddd) formatted = `(${ddd}`;
    if (ddd && ddd.length === 2) formatted += ') ';
    if (prefix) formatted += prefix;
    if (suffix) formatted += `-${suffix}`;
    return formatted;
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  function onSubmit(data: RegisterFormInputs) {
    console.log('Register:', data);
    // Aqui chame sua API para criar o usuário, incluindo profileImage se desejar
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Esquerda: imagem ou frase */}
      <div
        className="bg-cover bg-left bg-no-repeat bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center flex flex-col flex-1"
        style={{ backgroundImage: "url('/images/bg.png')" }}
      >
        <div className="w-full h-full flex flex-col p-5 bg-gradient-to-br from-transparent to-black/70 items-center justify-center">
          <h1 className="text-4xl font-bold mb-4 text-center text-shadow-accent">
            Crie sua conta <br /> no OTAKU STARS!
          </h1>
          <p className="text-lg opacity-90 text-center text-shadow-accent">
            Participe da comunidade e aproveite todos os benefícios.
          </p>
        </div>
      </div>

      {/* Direita: formulário */}
      <div className="flex flex-1 items-center justify-center p-8 max-w-2xl">
        <div className="w-full max-w-md">
          {/* Upload de imagem de perfil */}
          <div
            className="relative rounded-full w-24 h-24 m-auto cursor-pointer border-2 border-dashed border-gray-400 overflow-hidden mb-6"
            onClick={handleImageClick}
            title="Clique para adicionar imagem de perfil"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Imagem de perfil"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs select-none">Adicionar imagem</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Seu nome"
                        className="placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="seu@email.com"
                        className="placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(handlePhoneChange(e.target.value))}
                        placeholder="(99) 99999-9999"
                        className="placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const strength = passwordStrength(field.value);
                  const strengthLabel =
                    ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Excelente'][strength] ||
                    'Muito fraca';

                  const strengthColor = [
                    'text-red-600',
                    'text-red-500',
                    'text-yellow-500',
                    'text-green-600',
                    'text-green-700',
                  ][strength] || 'text-red-600';

                  return (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="******"
                            className="placeholder:text-gray-400"
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
                        className="p-0 text-xs"
                      >
                        Gerar senha segura
                      </Button>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

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
                          type={confirmPasswordVisible ? 'text' : 'password'}
                          placeholder="******"
                          className="placeholder:text-gray-400"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        aria-label={
                          confirmPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
                        }
                      >
                        {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" variant="outline" className="w-full cursor-pointer">
                Cadastrar
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <Link href="/login">
              <Button variant="link">Já tem conta? Faça login</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
