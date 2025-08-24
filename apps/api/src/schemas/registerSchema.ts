import { z } from "zod";
import { Locale, t } from "../locales";


export const registerSchema = (lang: Locale) =>
	z.object({
		username: z
			.string()
			.min(3, { message: t(lang, "USERNAME_MIN_LENGTH") }),
		email: z
			.string()
			.email({ message: t(lang, "INVALID_EMAIL") }),
		password: z
			.string()
			.min(6, { message: t(lang, "PASSWORD_MIN_LENGTH") }),
	});

export type RegisterInput = z.infer<ReturnType<typeof registerSchema>>;
