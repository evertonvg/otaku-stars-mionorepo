import { Metadata } from 'next';
import LoginPageClient from './pageClient';

export const metadata: Metadata = {
  title: 'Login | Otaku Stars',
  description: 'Faça login na sua conta Otaku Stars para aproveitar todos os recursos da plataforma.',
  openGraph: {
    title: 'Login | Otaku Stars',
    description: 'Acesse sua conta Otaku Stars agora mesmo!',
    url: 'https://seusite.com/login',
    siteName: 'Otaku Stars',
    images: [
      {
        url: '/images/og-login.png',
        width: 1200,
        height: 630,
        alt: 'Login Otaku Stars',
      },
    ],
    type: 'website',
  },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
