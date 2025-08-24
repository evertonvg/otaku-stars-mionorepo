import { z } from "zod";
import { Locale, t } from "../locales";


export const resendPasswordSchema = (lang: Locale) =>
	z.object({
		email: z
			.string()
			.email({ message: t(lang, "INVALID_EMAIL") }),
	});

export type ResendPasswordInput = z.infer<ReturnType<typeof resendPasswordSchema>>;
