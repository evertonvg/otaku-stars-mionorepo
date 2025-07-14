// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string | number;
			username: string;
			email: string;
			roleId: string;
		};
	}
	interface User {
		id: string | number;
		username: string;
		email: string;
		roleId: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string | number;
		username: string;
		email: string;
		roleId: string;
	}
}
