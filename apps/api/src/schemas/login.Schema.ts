import { z } from "zod";
import { Locale, t } from "../locales";

export const loginSchema = (lang: Locale) =>
	z.object({
		identifier: z
			.string()
			.min(3, { message: t(lang, "IDENTIFIER_REQUIRED") }),
		password: z
			.string()
			.min(6, { message: t(lang, "PASSWORD_TOO_SHORT") }),
	});

export type LoginInput = z.infer<ReturnType<typeof loginSchema>>;
