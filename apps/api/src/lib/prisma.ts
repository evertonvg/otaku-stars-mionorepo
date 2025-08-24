// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Carrega .env.test se estiver em teste
if (process.env.NODE_ENV === "test") {
	dotenv.config({ path: ".env.test" });
} else {
	dotenv.config();
}

const prisma = new PrismaClient();
export default prisma;
