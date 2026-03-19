import { Pool } from "pg";
import { env } from "../config/env";

let pool: Pool | null = null;

export async function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl
    });
  }

  return pool;
}
