export const activateAccount = async (token: string) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/activate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token }),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message || 'Erro ao ativar conta.');
	}

	return data.message;
};