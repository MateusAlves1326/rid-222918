import { getDb } from "./connection";

export async function runMigrations() {
  const db = await getDb();

  await db.query(`
    CREATE TABLE IF NOT EXISTS livros (
      id SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL,
      numero_paginas INTEGER NOT NULL,
      isbn TEXT NOT NULL UNIQUE,
      editora TEXT NOT NULL
    );
  `);
}

if (process.argv[1] && process.argv[1].includes("migrate.ts")) {
  runMigrations()
    .then(() => {
      console.log("Migracoes executadas com sucesso.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Erro ao executar migracoes:", error);
      process.exit(1);
    });
}
