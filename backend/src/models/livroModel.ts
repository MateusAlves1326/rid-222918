import { supabase } from "../database/supabaseClient";
import type { Livro, LivroPayload } from "../types/livro";

const LIVRO_COLUMNS = "id, titulo, numero_paginas, isbn, editora";

function toInternalError(message: string, error: unknown) {
  const internal = new Error(message) as Error & { status?: number };
  internal.status = 500;
  (internal as Error & { cause?: unknown }).cause = error;
  return internal;
}

export async function findAll() {
  const { data, error } = await supabase.from("livros").select(LIVRO_COLUMNS).order("id", { ascending: false });

  if (error) {
    throw toInternalError("Erro ao listar livros.", error);
  }

  return (data as Livro[]) || [];
}

export async function findById(id: number) {
  const { data, error } = await supabase.from("livros").select(LIVRO_COLUMNS).eq("id", id).maybeSingle();

  if (error) {
    throw toInternalError("Erro ao buscar livro por id.", error);
  }

  return (data as Livro | null) || null;
}

export async function findByIsbn(isbn: string) {
  const { data, error } = await supabase.from("livros").select(LIVRO_COLUMNS).eq("isbn", isbn).maybeSingle();

  if (error) {
    throw toInternalError("Erro ao buscar livro por ISBN.", error);
  }

  return (data as Livro | null) || null;
}

export async function create(livro: LivroPayload) {
  const { data, error } = await supabase.from("livros").insert(livro).select(LIVRO_COLUMNS).single();

  if (error) {
    throw toInternalError("Erro ao criar livro.", error);
  }

  return (data as Livro) || null;
}

export async function update(id: number, livro: LivroPayload) {
  const { data, error } = await supabase.from("livros").update(livro).eq("id", id).select(LIVRO_COLUMNS).maybeSingle();

  if (error) {
    throw toInternalError("Erro ao atualizar livro.", error);
  }

  return (data as Livro | null) || null;
}

export async function remove(id: number) {
  const { data, error } = await supabase.from("livros").delete().eq("id", id).select("id").maybeSingle();

  if (error) {
    throw toInternalError("Erro ao remover livro.", error);
  }

  return Boolean(data);
}
