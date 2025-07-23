'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type BackButtonProps = {
	className?: string;
};

export default function BackButton({ className }: BackButtonProps) {
	const pathname = usePathname();
	const router = useRouter();

	const handleBack = async () => {
		router.back();
	};

	if (pathname === '/login' || pathname == '/reset-password') return null;

	return (
		<Button onClick={handleBack} className={`cursor-pointer ${className || ''}`} variant="ghost">
			<ArrowLeft /> Voltar
		</Button>
	);
}
