import { getServerSession } from 'next-auth';

import { redirect } from 'next/navigation';


import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import LogoutButton from '@/app/_components/client/logout-button';

export default async function Home() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/login');
	}

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-6">
			<h1 className="text-4xl font-bold">Bem-vindo, {session.user?.username || 'usuário'}!</h1>
			{session.user?.email}
			{session.user?.role.name}
			<LogoutButton />
		</div>
	);
}
