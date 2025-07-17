import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	const email = 'admin@localhost.dev';
	const rawPassword = 'admin123'; // mínimo 6 caracteres
	const username = 'admin';

	// Verificar/ criar role admin
	let adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });

	if (!adminRole) {
		adminRole = await prisma.role.create({
			data: { name: 'admin' },
		});
		console.log('Role "admin" criada.');
	}

	// Verificar se o usuário já existe
	const existing = await prisma.user.findUnique({ where: { email } });

	if (existing) {
		console.log('Usuário admin já existe.');
		return;
	}

	// Criar usuário com senha hash
	const hashedPassword = await bcrypt.hash(rawPassword, 10);

	await prisma.user.create({
		data: {
			email,
			username,
			password: hashedPassword,
			isVerified: true,
			roleId: adminRole.id,
		},
	});

	console.log(`Usuário admin criado com sucesso: ${email} / ${rawPassword}`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
