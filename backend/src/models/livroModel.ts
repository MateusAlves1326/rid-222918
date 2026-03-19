import { supabase } from "../database/supabaseClient";
import type { Livro, LivroPayload } from "../types/livro";

const LIVRO_COLUMNS = "id, titulo, numero_paginas, isbn, editora";

function toHttpError(status: number, message: string, cause?: unknown) {
  const httpError = new Error(message) as Error & { status?: number; cause?: unknown };
  httpError.status = status;
  httpError.cause = cause;
  return httpError;
}

function mapSupabaseError(defaultMessage: string, error: unknown) {
  const supabaseError = (error || {}) as {
    code?: string;
    message?: string;
    details?: string;
  };

  const code = supabaseError.code || "";
  const message = supabaseError.message || "";
  const details = supabaseError.details || "";
  const joined = `${message} ${details}`.toLowerCase();

  if (code === "23505" || joined.includes("duplicate")) {
    return toHttpError(409, "Ja existe um livro com este ISBN.", error);
  }

  if (code === "42501" || code === "PGRST301" || joined.includes("row-level security")) {
    return toHttpError(403, "Sem permissao no Supabase. Verifique as politicas RLS da tabela livros.", error);
  }

  if (code === "42P01" || code === "PGRST205") {
    return toHttpError(500, "Tabela livros nao encontrada no Supabase. Crie a tabela no SQL Editor.", error);
  }

  return toHttpError(500, defaultMessage, error);
}

export async function findAll() {
  const { data, error } = await supabase.from("livros").select(LIVRO_COLUMNS).order("id", { ascending: false });

  if (error) {
    throw mapSupabaseError("Erro ao listar livros.", error);
  }

  return (data as Livro[]) || [];
}

export async function findById(id: number) {
  const { data, error } = await supabase.from("livros").select(LIVRO_COLUMNS).eq("id", id).maybeSingle();

  if (error) {
    throw mapSupabaseError("Erro ao buscar livro por id.", error);
  }

  return (data as Livro | null) || null;
}

export async function findByIsbn(isbn: string) {
  const { data, error } = await supabase.from("livros").select(LIVRO_COLUMNS).eq("isbn", isbn).maybeSingle();

  if (error) {
    throw mapSupabaseError("Erro ao buscar livro por ISBN.", error);
  }

  return (data as Livro | null) || null;
}

export async function create(livro: LivroPayload) {
  const { data, error } = await supabase.from("livros").insert(livro).select(LIVRO_COLUMNS).single();

  if (error) {
    throw mapSupabaseError("Erro ao criar livro.", error);
  }

  return (data as Livro) || null;
}

export async function update(id: number, livro: LivroPayload) {
  const { data, error } = await supabase.from("livros").update(livro).eq("id", id).select(LIVRO_COLUMNS).maybeSingle();

  if (error) {
    throw mapSupabaseError("Erro ao atualizar livro.", error);
  }

  return (data as Livro | null) || null;
}

export async function remove(id: number) {
  const { data, error } = await supabase.from("livros").delete().eq("id", id).select("id").maybeSingle();

  if (error) {
    throw mapSupabaseError("Erro ao remover livro.", error);
  }

  return Boolean(data);
}
