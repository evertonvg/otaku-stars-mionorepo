// app/api/auth/[...nextauth]/authOptions.ts
import type { NextAuthOptions } from 'next-auth';
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
				// Validação inicial
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
						// Mensagem personalizada para conta não verificada
						if (result?.message?.toLowerCase().includes('verificada')) {
							throw new Error('Conta não verificada. Verifique seu e-mail.');
						}

						// Outros erros genéricos (senha errada, usuário inexistente, etc.)
						throw new Error(result?.message || 'Usuário ou senha inválidos.');
					}

					// Apenas dados seguros que serão incluídos no JWT
					const { id, username, email, roleId } = result.user ?? result;

					console.log('Usuário autenticado:', { id, username, email, roleId });
					return { id, username, email, roleId };

				} catch (error) {
					// Garante que qualquer exceção será repassada como mensagem legível
					const message = error instanceof Error ? error.message : 'Erro ao fazer login.';
					throw new Error(message);
				}
			},
		}),
	],

	// Sessão baseada em JWT (padrão para App Router)
	session: {
		strategy: 'jwt',
	},

	// Página customizada de login
	pages: {
		signIn: '/login',
	},

	// 🔒 Chave secreta obrigatória para JWT
	secret: process.env.NEXTAUTH_SECRET,

	// 🔁 Callbacks para persistir dados do usuário na sessão
	callbacks: {
		async jwt({ token, user }) {
			// Se for a primeira vez (login), adiciona os dados do usuário no token
			if (user) {
				token.id = user.id;
				token.username = user.username;
				token.email = user.email;
				token.roleId = user.roleId;
			}
			return token;
		},

		async session({ session, token }) {
			// Repassa os dados do token para a session
			if (token) {
				session.user = {
					id: token.id as string | number,
					username: token.username as string,
					email: token.email as string,
					roleId: token.roleId as string,
				};
			}
			return session;
		},
	},
};
