'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

type BackButtonProps = {
	className?: string;
};

export default function BackButton({ className }: BackButtonProps) {
	const t = useTranslations('buttons');

	const pathname = usePathname();
	const router = useRouter();

	const handleBack = async () => {
		router.back();
	};

	if (pathname === '/login' || pathname == '/reset-password') return null;

	return (
		<Button onClick={handleBack} className={`cursor-pointer ${className || ''}`} variant="ghost">
			<ArrowLeft /> {t('back')}
		</Button>
	);
}
