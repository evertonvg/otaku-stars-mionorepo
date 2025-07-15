import { ResetPasswordForm } from "@/schema/resetPasswordSchema";

export async function resetPassword(data: ResetPasswordForm, token: string = '') {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${token}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ password: data.password }),
	});

	const result = await res.json();
	if (!res.ok) throw new Error(result.message || 'Erro ao redefinir senha');
	return result.message;
}