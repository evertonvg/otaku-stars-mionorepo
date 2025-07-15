// types/next-auth.d.ts
// import NextAuth from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

type Role = {
	id: number;
	name: string;
};

declare module 'next-auth' {
	interface Session {
		user: {
			id: string | number;
			username: string;
			email: string;
			role: Role;
		};
	}

	interface User {
		id: string | number;
		username: string;
		email: string;
		role: Role;
		isVerified: boolean | string
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		id: string | number;
		username: string;
		email: string;
		role: Role;
	}
}
