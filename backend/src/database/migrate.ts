export async function runMigrations() {
  console.log("Modo Supabase: nao ha migracoes locais para executar.");
  console.log("Crie/atualize a tabela livros pelo SQL Editor do Supabase.");
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
