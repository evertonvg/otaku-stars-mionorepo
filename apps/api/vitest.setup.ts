import dotenv from "dotenv";

// Carrega .env.test antes de qualquer import
dotenv.config({ path: ".env.test" });
process.env.NODE_ENV = "test";
