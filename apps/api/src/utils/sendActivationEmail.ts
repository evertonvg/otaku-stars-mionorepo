import { transporter } from "./mailer";

export async function sendActivationEmail(email: string, username: string, activationLink: string) {
	await transporter.sendMail({
		from: `"Minha Plataforma" <${process.env.MAIL_USER}>`,
		to: email,
		subject: 'Ative sua conta',
		html: `
		<p>Olá, ${username}!</p>
		<p>Obrigado por se registrar. Clique no link abaixo para ativar sua conta:</p>
		<a href="${activationLink}">Ativar conta</a>
		<p>Este link expira em 24 horas.</p>
	  `,
	});
}