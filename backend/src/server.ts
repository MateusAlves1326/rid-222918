import app from "./app";
import { env } from "./config/env";
import { runMigrations } from "./database/migrate";

async function startServer() {
  await runMigrations();

  app.listen(env.port, () => {
    console.log(`API de biblioteca rodando na porta ${env.port}`);
  });
}

startServer().catch((error) => {
  if (error && typeof error === "object" && "code" in error && error.code === "28P01") {
    console.error("Falha de autenticacao no PostgreSQL (codigo 28P01).");
    console.error("Revise usuario/senha em DB_USERNAME/DB_PASSWORD ou DATABASE_URL no arquivo backend/.env.");
    console.error(`DATABASE_URL atual: ${env.databaseUrl}`);
  }

  console.error("Falha ao iniciar servidor:", error);
  process.exit(1);
});
