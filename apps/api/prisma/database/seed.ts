import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	const roles = ['user', 'admin'];

	for (const name of roles) {
		await prisma.role.upsert({
			where: { name },
			update: {},
			create: { name },
		});
	}

	const defaultRole = await prisma.role.findFirstOrThrow({ where: { name: 'user' } });
	const adminRole = await prisma.role.findFirstOrThrow({ where: { name: 'admin' } });

	for (let i = 0; i < 40; i++) {
		const username = faker.internet.userName().toLowerCase();
		const email = faker.internet.email().toLowerCase();
		const password = await bcrypt.hash('123456', 10);

		try {
			await prisma.user.create({
				data: {
					username,
					email,
					password,
					roleId: defaultRole.id,
					isVerified: true,
					isBanned: false,
					isActive: true,
				},
			});
			if (i % 10 === 0) console.log(`➡️ ${i + 1} usuários criados...`);
		} catch (err: any) {
			console.error(`⚠️ Erro ao criar ${username}:`, err?.message);
		}
	}

	try {
		await prisma.user.create({
			data: {
				username: 'admin',
				email: 'admin@admin.com',
				password: await bcrypt.hash('admin123', 10),
				roleId: adminRole.id,
				isVerified: true,
				isBanned: false,
				isActive: true,
			},
		});
		console.log('✅ Usuário admin criado');
	} catch (err: any) {
		console.error(`⚠️ Erro ao criar admin:`, err?.message);
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		console.log('🌱 Seed finalizado com sucesso!');
		await prisma.$disconnect();
	});
