import type { Livro, LivroPayload } from "../types/livro";
import { supabase } from "./supabaseClient";

export class LivrosSupabaseService {
  static async getLivros() {
    const { data, error } = await supabase
      .from("livros")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar livros: ${error.message}`);
    }

    return { data: (data as Livro[]) || [] };
  }

  static async getLivro(id: number) {
    const { data, error } = await supabase
      .from("livros")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Livro não encontrado
        throw new Error("Livro não encontrado");
      }
      throw new Error(`Erro ao buscar livro: ${error.message}`);
    }

    return { data: data as Livro };
  }

  static async createLivro(body: LivroPayload) {
    const { data, error } = await supabase
      .from("livros")
      .insert([body])
      .select()
      .single();

    if (error) {
      if (error.message.includes("duplicate key")) {
        throw new Error("ISBN já cadastrado");
      }
      throw new Error(`Erro ao criar livro: ${error.message}`);
    }

    return { data: data as Livro };
  }

  static async updateLivro(id: number, body: LivroPayload) {
    const { data, error } = await supabase
      .from("livros")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.message.includes("duplicate key")) {
        throw new Error("ISBN já cadastrado");
      }
      throw new Error(`Erro ao atualizar livro: ${error.message}`);
    }

    return { data: data as Livro };
  }

  static async deleteLivro(id: number) {
    const { error } = await supabase
      .from("livros")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Erro ao deletar livro: ${error.message}`);
    }

    return { data: { mensagem: "Livro deletado com sucesso" } };
  }
}
