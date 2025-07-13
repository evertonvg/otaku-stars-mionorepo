import { RegisterFormInputs } from '@/schema/registerSchema';
export async function registerUser(data: RegisterFormInputs) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			username: data.name,
			email: data.email,
			password: data.password,
		}),
	});

	if (!res.ok) {
		let message = 'Erro no registro';
		try {
			const errorData = await res.json();
			message = errorData.message || message;
		} catch {
			// Ignora se não conseguir parsear JSON
		}
		throw new Error(message);
	}

	return res.json();
}