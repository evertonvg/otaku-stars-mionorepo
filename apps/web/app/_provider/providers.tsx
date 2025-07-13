'use client';

import React, { ReactNode, useState } from 'react';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ProviderProps {
	children: ReactNode;
}

export function Providers({ children }: ProviderProps) {
	// Criar o QueryClient dentro do estado para manter a instancia estável no client
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster richColors position="top-right" />
		</QueryClientProvider>
	);
}
