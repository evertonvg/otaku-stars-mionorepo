'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
	const pathname = usePathname();
	const router = useRouter();

	const handleBack = async () => {
		router.back();
	};

	if (pathname === '/login' || pathname == '/reset-password') return null;

	return (
		<Button onClick={handleBack} className='absolute top-4 md:top-12 left-4 cursor-pointer'>
			<ArrowLeft /> Voltar
		</Button>
	);
}
