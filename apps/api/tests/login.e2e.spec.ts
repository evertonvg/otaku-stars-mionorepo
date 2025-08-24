import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import supertest from "supertest";
import bcrypt from "bcrypt";

import prisma from "../src/lib/prisma";
import loginRoute from "../src/routes/auth/login";

describe("Login API E2E", () => {
	let app: ReturnType<typeof Fastify>;
	let request: ReturnType<typeof supertest>;

	const testUser = {
		username: "testuser",
		email: "testuser@example.com",
		password: "password123",
	};

	let createdUserId: number;

	beforeAll(async () => {
		app = Fastify();

		// Adiciona decorators que loginRoute espera
		app.decorateReply("success", function (code: string, data?: any) {
			return this.send({ success: true, code, ...data });
		});
		app.decorateReply("error", function (code: string, status: number, err?: any) {
			return this.status(status).send({ success: false, code, error: err?.message });
		});

		// Registra rota de login
		app.register(loginRoute, { prefix: "/api/auth" });
		await app.ready();

		request = supertest(app.server);

		// Pega uma role existente
		const role = await prisma.role.findFirst();
		if (!role) throw new Error("Nenhuma role encontrada no banco de teste");

		// Cria usuário de teste
		const passwordHash = await bcrypt.hash(testUser.password, 10);
		const user = await prisma.user.create({
			data: {
				username: testUser.username,
				email: testUser.email,
				password: passwordHash,
				isVerified: true,
				isActive: true,
				isBanned: false,
				role: { connect: { id: role.id } },
			},
		});

		createdUserId = user.id;
	});

	afterAll(async () => {
		// Remove usuário de teste
		await prisma.user.deleteMany({ where: { id: createdUserId } });
		await app.close();
		await prisma.$disconnect();
	});

	it("should login successfully with correct credentials", async () => {
		const res = await request.post("/api/auth/login").send({
			identifier: testUser.email,
			password: testUser.password,
		});

		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.code).toBe("LOGIN_SUCCESS");
		expect(res.body.user).toHaveProperty("id");
		expect(res.body.user.email).toBe(testUser.email);
	});

	it("should return error for invalid credentials", async () => {
		const res = await request.post("/api/auth/login").send({
			identifier: "wronguser@example.com",
			password: "wrongpass",
		});

		expect(res.status).toBe(401);
		expect(res.body.success).toBe(false);
		expect(res.body.code).toBe("INVALID_CREDENTIALS");
	});
});
