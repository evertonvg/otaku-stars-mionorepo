import { transporter } from "./mailer";
import { t, Locale } from "../locales"; // sua função de tradução

export async function sendForgotPassword(
	resetUrl: string,
	email: string,
	lang: Locale = "pt"
) {
	await transporter.sendMail({
		from: `"Otaku Stars" <${process.env.MAIL_USER}>`,
		to: email,
		subject: t(lang, 'ACTIVATION_EMAIL_SUBJECT'),
		html: `<p>: <a href="${resetUrl}">${resetUrl}</a></p>`,
	});
}
