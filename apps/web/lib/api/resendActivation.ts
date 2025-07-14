export const resendActivation = async (email: string) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-activation`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email }),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message || 'Erro ao reenviar ativação.');
	}

	return data.message;
};