// File: app/(public)/register/page.tsx
import { Metadata } from 'next';
import RegisterPageClient from './pageClient';

export const metadata: Metadata = {
  title: 'Cadastro | Otaku Stars',
  description: 'Crie sua conta Otaku Stars para acessar todos os recursos da plataforma.',
  openGraph: {
    title: 'Cadastro | Otaku Stars',
    description: 'Junte-se à comunidade Otaku Stars agora mesmo!',
    url: 'https://seusite.com/register',
    siteName: 'Otaku Stars',
    images: [
      {
        url: '/images/og-register.png',
        width: 1200,
        height: 630,
        alt: 'Cadastro Otaku Stars',
      },
    ],
    type: 'website',
  },
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
