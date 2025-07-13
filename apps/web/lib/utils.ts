import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const passwordStrength = (password: string) => {
	let score = 0;
	if (password.length >= 8) score++;
	if (/[A-Z]/.test(password)) score++;
	if (/[a-z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^A-Za-z0-9]/.test(password)) score++;
	return score;
};

export const generatePassword = () => {
	const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lower = 'abcdefghijklmnopqrstuvwxyz';
	const numbers = '0123456789';
	const symbols = '!@#$%^&*()';
	const all = upper + lower + numbers + symbols;

	const getRandom = (str: string) => str[Math.floor(Math.random() * str.length)];

	let password = '';
	// Garantir pelo menos 1 de cada tipo
	password += getRandom(upper);
	password += getRandom(lower);
	password += getRandom(numbers);
	password += getRandom(symbols);

	// Completar até 14 caracteres com qualquer caractere do conjunto
	for (let i = 4; i < 14; i++) {
		password += getRandom(all);
	}

	// Embaralhar a senha para não ficar sempre na mesma ordem
	password = password
		.split('')
		.sort(() => Math.random() - 0.5)
		.join('');

	return password;
};

export const maskPhoneChange = (value: string) => {
	const digits = value.replace(/\D/g, '').slice(0, 11); // máximo 11 dígitos (2 DDD + 9)
	const match = digits.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
	if (!match) return value;
	const [, ddd, prefix, suffix] = match;
	let formatted = '';
	if (ddd) formatted = `(${ddd}`;
	if (ddd && ddd.length === 2) formatted += ') ';
	if (prefix) formatted += prefix;
	if (suffix) formatted += `-${suffix}`;
	return formatted;
};
