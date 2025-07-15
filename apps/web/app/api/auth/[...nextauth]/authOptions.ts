// app/api/auth/[...nextauth]/authOptions.ts
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				identifier: { label: 'Email ou usuário', type: 'text' },
				password: { label: 'Senha', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.identifier || !credentials.password) {
					throw new Error('Credenciais inválidas.');
				}

				try {
					const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							identifier: credentials.identifier,
							password: credentials.password,
						}),
					});

					const result = await res.json();

					if (!res.ok) {
						if (result?.message?.toLowerCase().includes('verificada')) {
							throw new Error('Conta não verificada. Verifique seu e-mail.');
						}

						throw new Error(result?.message || 'Usuário ou senha inválidos.');
					}

					const { id, username, email, role, isVerified } = result.user ?? result;

					return { id, username, email, role, isVerified: isVerified ?? true };

				} catch (error) {
					const message = error instanceof Error ? error.message : 'Erro ao fazer login.';
					throw new Error(message);
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		})
	],

	session: {
		strategy: 'jwt',
	},

	pages: {
		signIn: '/login',
	},

	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async jwt({ token, user, account, profile }) {
			// ✅ Login com Google (via OAuth)
			if (account?.provider === 'google' && profile?.email) {
				try {
					const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/google`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: profile.email,
							name: profile.name,
						}),
					});

					const data = await res.json();

					if (!res.ok) {
						throw new Error(data.message || 'Erro no login com Google.');
					}

					token.id = data.id;
					token.username = data.username;
					token.email = data.email;
					token.role = data.role;
					token.isVerified = data.isVerified;

				} catch (error) {
					console.error('Erro ao logar com Google:', error);
					throw new Error('Erro ao autenticar com Google.');
				}
			}

			// ✅ Login com credenciais
			if (user) {
				token.id = user.id;
				token.username = user.username;
				token.email = user.email;
				token.role = user.role;
				token.isVerified = user.isVerified ?? true; // default: true para login com credenciais
			}

			return token;
		}
		,

		async session({ session, token }) {
			if (token) {
				session.user = {
					id: token.id as number,
					username: token.username as string,
					email: token.email as string,
					role: token.role as {
						id: number;
						name: string;
					},
				};
			}
			return session;
		},
	},
};
