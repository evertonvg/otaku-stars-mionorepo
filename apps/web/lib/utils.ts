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

// export const handleGeneratePassword = () => {
//     const charset =
//       'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
//     const password = Array.from({ length: 12 }, () =>
//       charset[Math.floor(Math.random() * charset.length)],
//     ).join('');
//     form.setValue('password', password);
//     form.setValue('confirmPassword', password);
//     setGeneratedPassword(password);
// };
