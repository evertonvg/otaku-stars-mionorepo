import { ReactNode, Children, isValidElement } from 'react';
import BackButton from '../client/back-button';
import { ThemeSwitch } from '../client/theme-switch';
import { LanguageSwitcher } from '../client/language-switch';

type bodyProps = {
	children: ReactNode;
};

type authLayoutProps = {
	image: string;
	children: ReactNode;
};

// Subcomponentes
const BodyTitle = ({ children }: bodyProps) => {
	return <>{children}</>;
};

const BodyContent = ({ children }: bodyProps) => {
	return <>{children}</>;
};

// Componente principal
export default function AuthLayout({ image, children }: authLayoutProps) {


	let bodyTitle: ReactNode = null;
	let bodyContent: ReactNode = null;

	// Itera pelos filhos e separa os subcomponentes
	Children.forEach(children, (child) => {
		if (!isValidElement(child)) return;

		if (child.type === AuthLayout.BodyTitle) {
			bodyTitle = child;
		} else if (child.type === AuthLayout.BodyContent) {
			bodyContent = child;
		}
	});



	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			{/* Lado esquerdo com imagem/frase */}
			<div
				className="bg-cover bg-left bg-no-repeat bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center flex flex-col flex-1"
				style={{
					backgroundImage: `url('/images/${image}')`,
				}}
			>
				<div className="w-full h-full flex flex-col p-5 bg-gradient-to-br from-transparent to-black/70 items-center justify-center">
					{bodyTitle}
				</div>
			</div>

			{/* Lado direito */}
			<div className="flex flex-1 items-center justify-center pt-20 md:pt-8 p-8 max-w-2xl relative">
				<BackButton className="absolute top-4 left-4" />
				<LanguageSwitcher className="absolute top-4 right-16" />
				<ThemeSwitch className="absolute top-4 right-4" />
				{bodyContent}
			</div>
		</div>
	);
}

AuthLayout.BodyTitle = BodyTitle;
AuthLayout.BodyContent = BodyContent;
