import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

export const env = {
  port: Number(process.env.PORT) || 3000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  supabaseUrl,
  supabaseServiceKey
};

if (!env.supabaseUrl || !env.supabaseServiceKey) {
  throw new Error("As variaveis SUPABASE_URL e SUPABASE_SERVICE_KEY (ou SUPABASE_PUBLISHABLE_KEY) sao obrigatorias para iniciar a API.");
}
