import app from "./app";
import { env } from "./config/env";

async function startServer() {
  app.listen(env.port, () => {
    console.log(`API de biblioteca rodando na porta ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Falha ao iniciar servidor:", error);
  process.exit(1);
});
