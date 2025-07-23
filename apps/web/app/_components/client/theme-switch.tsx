'use client'

// import { useTheme } from 'next-themes'
// import { useEffect, useState } from 'react'
// import { Switch } from '@/components/ui/switch'
// import { Moon, Sun } from 'lucide-react'

// type SwitchkButtonProps = {
// 	className?: string;
// };

// export function ThemeSwitch({ className }: SwitchkButtonProps) {
// 	const { theme, setTheme } = useTheme()
// 	const [mounted, setMounted] = useState(false)

// 	// Impede problemas de renderização durante o SSR
// 	useEffect(() => setMounted(true), [])

// 	if (!mounted) return null

// 	const isDark = theme === 'dark'

// 	return (
// 		<div className={`flex items-center gap-2 cursor-pointer ${className || ''}`}>
// 			<Sun className="h-4 w-4 text-yellow-400" />
// 			<Switch
// 				checked={isDark}
// 				onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
// 			/>
// 			<Moon className="h-4 w-4 text-blue-500" />
// 		</div>
// 	)
// }


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
						<Sun className="mr-2 h-4 w-4" /> Claro
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('dark')}>
						<Moon className="mr-2 h-4 w-4" /> Escuro
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('system')}>
						<Laptop className="mr-2 h-4 w-4" /> Sistema
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu >
		</div>
	)
}

