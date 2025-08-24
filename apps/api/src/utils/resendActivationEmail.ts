import { transporter } from "./mailer";
import { t, Locale } from "../locales"; // sua função de tradução

export async function resendActivationEmail(
	email: string,
	username: string,
	activationLink: string,
	lang: Locale = "pt"
) {
	await transporter.sendMail({
		from: `"Otaku Stars" <${process.env.MAIL_USER}>`,
		to: email,
		subject: t(lang, "RESEND_ACTIVATION_SUBJECT"),
		html: `
			<p>${t(lang, "EMAIL_ACTIVATION_GREETING").replace("{username}", username)}</p>
			<p>${t(lang, "RESEND_ACTIVATION_BODY")}</p>
			<a href="${activationLink}">${t(lang, "EMAIL_ACTIVATION_BUTTON")}</a>
			<p>${t(lang, "EMAIL_ACTIVATION_EXPIRES")}</p>
		`,
	});
}
