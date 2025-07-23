'use client';

import React, { ReactNode, useState } from 'react';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider'; // Importando o ThemeProvider
import type { Session } from 'next-auth';

interface ProviderProps {
	children: ReactNode;
	session?: Session | null;
}

export function Providers({ children, session }: ProviderProps) {
	// Criar o QueryClient dentro do estado para manter a instancia estável no client
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider session={session}>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					{children}
					<Toaster richColors position="top-right" />
				</ThemeProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
}
