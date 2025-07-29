'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { activateAccount } from '@/lib/api/activateAccount';
import AuthLayout from '@/app/_components/server/auth-layout';

export default function ActivateClient() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const mutation = useMutation({
		mutationFn: activateAccount,
	});

	useEffect(() => {
		if (token) mutation.mutate(token);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	return (
		<AuthLayout image='verify.jpg'>
			<AuthLayout.BodyTitle>
				<h1 className='text-4xl font-bold mb-4 text-center text-shadow-accent'>Autentique sua conta</h1>
			</AuthLayout.BodyTitle>
			<AuthLayout.BodyContent>
				<div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
					{mutation.isPending && <p className="text-lg">Ativando sua conta...</p>}

					{mutation.isSuccess && (
						<div>
							<CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
							<h2 className="text-2xl font-semibold mb-2">Sucesso!</h2>
							<p className="mb-6">{mutation.data}</p>
							<Link href="/login">
								<Button>Fazer login</Button>
							</Link>
						</div>
					)}

					{mutation.isError && (
						<div>
							<XCircle size={48} className="text-red-600 mx-auto mb-4" />
							<h2 className="text-2xl font-semibold mb-2">Erro</h2>
							<p className="mb-6">{mutation.error.message}</p>
							<Link href="/">
								<Button variant="link">Voltar para o início</Button>
							</Link>
						</div>
					)}
				</div>
			</AuthLayout.BodyContent>
		</AuthLayout>

	);
}
