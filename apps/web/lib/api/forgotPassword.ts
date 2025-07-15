import { ForgotPasswordForm } from "@/schema/forgotPasswordSchema";

export async function forgotPassword(data: ForgotPasswordForm) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	console.warn(res.text())
	const result = await res.json();
	if (!res.ok) throw new Error(result.message || 'Erro ao solicitar recuperação de senha');
	return result.message;
}