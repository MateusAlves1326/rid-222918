import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = Number(process.env.DB_PORT) || 5432;
const dbUsername = process.env.DB_USERNAME || "postgres";
const dbPassword = process.env.DB_PASSWORD || "postgres";
const dbName = process.env.DB_NAME || "biblioteca";

const databaseUrlFromParts = `postgresql://${encodeURIComponent(dbUsername)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`;
const hasDbVars =
  Boolean(process.env.DB_HOST) ||
  Boolean(process.env.DB_PORT) ||
  Boolean(process.env.DB_USERNAME) ||
  Boolean(process.env.DB_PASSWORD) ||
  Boolean(process.env.DB_NAME);

export const env = {
  port: Number(process.env.PORT) || 3000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  databaseUrl: hasDbVars
    ? databaseUrlFromParts
    : process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/biblioteca"
};
