'use client'
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Laptop, Moon, Sun } from 'lucide-react'

type SwitchkButtonProps = {
	className?: string;
};

export function ThemeSwitch({ className }: SwitchkButtonProps) {
	const t = useTranslations('themes');
	const { setTheme, theme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	if (!mounted) return null

	const icon = theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />

	return (
		<div className={className}>
			< DropdownMenu modal={false} >
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon" aria-label="Alternar tema">
						{icon}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setTheme('light')}>
						<Sun className="mr-2 h-4 w-4" /> {t('light')}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('dark')}>
						<Moon className="mr-2 h-4 w-4" /> {t('dark')}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('system')}>
						<Laptop className="mr-2 h-4 w-4" /> {t('system')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu >
		</div>
	)
}

