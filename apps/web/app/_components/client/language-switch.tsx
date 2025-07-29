'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import ReactCountryFlag from "react-country-flag";

export function LanguageSwitcher({ className }: { className?: string }) {
	const router = useRouter();
	const pathname = usePathname();
	const currentLocale = useLocale();

	const languages = [
		{ code: 'pt', name: 'Português' },
		{ code: 'en', name: 'English' },
		{ code: 'es', name: 'Español' },
	];

	const switchLanguage = (locale: string) => {
		// Remove o locale atual do pathname
		const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`);
		router.push(newPathname);
	};


	return (
		<span className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon" className="gap-2">
						<Languages className="h-[1.2rem] w-[1.2rem]" />
						<span className="sr-only">Trocar idioma</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{languages.map((language) => (
						<DropdownMenuItem
							key={language.code}
							onClick={() => switchLanguage(language.code)}
							className="flex items-center gap-2"
						>
							<ReactCountryFlag
								countryCode={getCountryCode(language.code)}
								svg
								style={{
									width: '1.2em',
									height: '1.2em',
								}}
								title={language.code.toUpperCase()}
							/>
							{language.name}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</span>
	);
}

function getCountryCode(locale: string): string {
	const mapping: Record<string, string> = {
		en: 'US',  // Inglês -> EUA
		pt: 'BR',  // Português -> Brasil
		es: 'ES',  // Espanhol -> Espanha
		fr: 'FR',  // Francês -> França
		de: 'DE',  // Alemão -> Alemanha
		// Adicione outros mapeamentos conforme necessário
	};
	return mapping[locale] || locale.toUpperCase();
}