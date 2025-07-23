import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	console.log('🔄 Gerando usuários...');

	let defaultRole = await prisma.role.findFirst({ where: { name: 'user' } });
	if (!defaultRole) defaultRole = { name: 'user', id: 2 };
	for (let i = 0; i < 40; i++) {
		const username = faker.internet.userName().toLowerCase();
		const email = faker.internet.email().toLowerCase();
		const password = await bcrypt.hash('123456', 10); // senha padrão para todos

		try {
			await prisma.user.create({
				data: {
					username,
					email,
					password,
					roleId: defaultRole.id,
					isVerified: true,
				},
			});
			console.log(`✅ Usuário ${username} criado`);
		} catch (err: any) {
			console.error(`⚠️ Erro ao criar ${username}:`, err?.message);
		}
	}

	console.log('✅ Seed completo');
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
