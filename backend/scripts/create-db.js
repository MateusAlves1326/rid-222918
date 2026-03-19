const path = require("path");
const dotenv = require("dotenv");
const { Client } = require("pg");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT) || 5432;
const user = process.env.DB_USERNAME || "postgres";
const password = process.env.DB_PASSWORD || "postgres";
const dbName = process.env.DB_NAME || "biblioteca";

if (!/^[a-zA-Z0-9_]+$/.test(dbName)) {
  console.error("Nome de banco invalido em DB_NAME. Use apenas letras, numeros e underscore.");
  process.exit(1);
}

async function createDatabaseIfNeeded() {
  const client = new Client({
    host,
    port,
    user,
    password,
    database: "postgres"
  });

  await client.connect();

  const result = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE \"${dbName}\"`);
    console.log(`Banco criado: ${dbName}`);
  } else {
    console.log(`Banco ja existe: ${dbName}`);
  }

  await client.end();
}

createDatabaseIfNeeded().catch((error) => {
  console.error("Falha ao criar banco:", error.message);
  process.exit(1);
});
