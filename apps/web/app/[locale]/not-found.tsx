'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/app/_components/server/auth-layout';
import { AlertTriangle } from 'lucide-react';
import '@/app/globals.css';

export default function NotFoundPage() {
	const router = useRouter();
	const [countdown, setCountdown] = useState(10);

	useEffect(() => {
		if (countdown === 0) {
			router.push('/');
			return;
		}

		const timer = setTimeout(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [countdown, router]);

	return (
		<AuthLayout image='error.webp'>
			<AuthLayout.BodyTitle>
				<AlertTriangle />
				<h1 className="text-4xl font-bold mb-4 text-center text-shadow-accent">
					Página não encontrada
				</h1>
				<p className="text-lg opacity-90 text-center text-shadow-accent">
					Alguém deve ter perdido o caminho...
				</p>
			</AuthLayout.BodyTitle>
			<AuthLayout.BodyContent>
				<div className="w-full max-w-md space-y-6">
					<p className="text-lg mb-6 relative z-20">
						Você será redirecionado para a página inicial em {countdown} segundos.
					</p>
					<Button className='cursor-pointer relative z-20 m-auto block' onClick={() => router.push('/')}>Ir agora</Button>

				</div>
			</AuthLayout.BodyContent>
		</AuthLayout>

	);
}
