'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import './globals.css'; // Import global styles

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
	}, [countdown]);

	return (

		<div className="min-h-screen flex flex-col md:flex-row">
			{/* Lado esquerdo com imagem/frase */}
			<div
				className="bg-cover bg-left bg-no-repeat bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center flex flex-col flex-1"
				style={{ backgroundImage: "url('/images/error.webp')" }}
			>
				<div className="w-full h-full flex flex-col p-5 bg-gradient-to-br from-transparent to-black/70 items-center justify-center">
					<AlertTriangle size={64} className="text-yellow-500 mb-4 relative z-20" />
					<h1 className="text-4xl font-bold mb-4 text-center text-shadow-accent">
						Página não encontrada
					</h1>
					<p className="text-lg opacity-90 text-center text-shadow-accent">
						Alguém deve ter perdido o caminho...
					</p>
				</div>
			</div>

			{/* Lado direito com formulário */}
			<div className="flex flex-1 items-center justify-center p-8 max-w-2xl">

				<div className="w-full max-w-md space-y-6">
					<p className="text-lg mb-6 relative z-20">
						Você será redirecionado para a página inicial em {countdown} segundos.
					</p>
					<Button className='cursor-pointer relative z-20 m-auto block' onClick={() => router.push('/')}>Ir agora</Button>

				</div>

			</div>
		</div>
	);
}
