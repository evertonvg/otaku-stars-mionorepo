import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';

export default async function Home() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/login');
	} else {
		redirect('/home');
	}
}
