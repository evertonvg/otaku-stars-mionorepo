'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {

	const router = useRouter();

	const handleLogout = async () => {
		await signOut({ redirect: false });
		router.push('/login');
	};

	return (
		<Button variant="destructive" onClick={handleLogout}>
			Sair
		</Button>
	);
}
