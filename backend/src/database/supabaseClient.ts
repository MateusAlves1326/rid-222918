import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials not configured. Skipping Supabase initialization.");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");
