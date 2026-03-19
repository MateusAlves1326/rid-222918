import { supabase } from "./supabaseClient";

async function seed() {
  const { count, error: countError } = await supabase
    .from("livros")
    .select("id", { count: "exact", head: true });

  if (countError) {
    throw countError;
  }

  const total = Number(count ?? 0);

  if (total > 0) {
    console.log("Seed ignorado: tabela livros ja possui dados.");
    return;
  }

  const { error: insertError } = await supabase.from("livros").insert([
    {
      titulo: "O Senhor dos Aneis",
      numero_paginas: 1178,
      isbn: "9788533613379",
      editora: "HarperCollins"
    },
    {
      titulo: "Clean Code",
      numero_paginas: 464,
      isbn: "9780132350884",
      editora: "Prentice Hall"
    },
    {
      titulo: "Dom Casmurro",
      numero_paginas: 288,
      isbn: "9788535910667",
      editora: "Companhia das Letras"
    }
  ]);

  if (insertError) {
    throw insertError;
  }

  console.log("Seed executado com sucesso: 3 livros inseridos.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  });
