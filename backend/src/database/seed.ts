import { getDb } from "./connection";
import { runMigrations } from "./migrate";

async function seed() {
  await runMigrations();
  const db = await getDb();

  const countResult = await db.query<{ total: string }>("SELECT COUNT(*) as total FROM livros");
  const total = Number(countResult.rows[0]?.total ?? 0);

  if (total > 0) {
    console.log("Seed ignorado: tabela livros ja possui dados.");
    return;
  }

  await db.query(
    "INSERT INTO livros (titulo, numero_paginas, isbn, editora) VALUES ($1, $2, $3, $4)",
    ["O Senhor dos Aneis", 1178, "9788533613379", "HarperCollins"]
  );

  await db.query(
    "INSERT INTO livros (titulo, numero_paginas, isbn, editora) VALUES ($1, $2, $3, $4)",
    ["Clean Code", 464, "9780132350884", "Prentice Hall"]
  );

  await db.query(
    "INSERT INTO livros (titulo, numero_paginas, isbn, editora) VALUES ($1, $2, $3, $4)",
    ["Dom Casmurro", 288, "9788535910667", "Companhia das Letras"]
  );

  console.log("Seed executado com sucesso: 3 livros inseridos.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  });
