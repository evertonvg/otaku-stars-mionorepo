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
		// error.webp
		<div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-cover bg-left bg-no-repeat bg-gradient-to-br from-indigo-600 to-purple-700 text-white  flex-1 relative before:absolute before:inset-0 before:bg-black/50 before:z-10 before:w-full before:h-full before:content-['']"
			style={{ backgroundImage: "url('/images/error.webp')" }}>
			<AlertTriangle size={64} className="text-yellow-500 mb-4 relative z-20" />
			<h1 className="text-4xl font-bold mb-2 relative z-20">Página não encontrada</h1>
			<p className="text-lg mb-6 relative z-20">
				Você será redirecionado para a página inicial em {countdown} segundos.
			</p>
			<Button className='cursor-pointer relative z-20' onClick={() => router.push('/')}>Ir agora</Button>
		</div>
	);
}
