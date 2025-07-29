// app/activate/page.tsx
import { Metadata } from 'next';
import ActivateClient from './pageClient';

export const metadata: Metadata = {
	title: 'Ativar conta',
	description: 'Confirmação de ativação da conta via e-mail.',
};

export default function ActivatePage() {
	return <ActivateClient />;
}
