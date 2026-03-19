import * as livroModel from "../models/livroModel";
import type { LivroPayload } from "../types/livro";

function createHttpError(status: number, message: string) {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  return error;
}

export async function listarLivros() {
  return livroModel.findAll();
}

export async function buscarLivroPorId(id: number) {
  const livro = await livroModel.findById(id);

  if (!livro) {
    throw createHttpError(404, "Livro nao encontrado.");
  }

  return livro;
}

export async function criarLivro(livroData: LivroPayload) {
  const isbnExistente = await livroModel.findByIsbn(livroData.isbn);

  if (isbnExistente) {
    throw createHttpError(409, "Ja existe um livro com este ISBN.");
  }

  return livroModel.create(livroData);
}

export async function atualizarLivro(id: number, livroData: LivroPayload) {
  const livroAtual = await livroModel.findById(id);

  if (!livroAtual) {
    throw createHttpError(404, "Livro nao encontrado.");
  }

  const isbnExistente = await livroModel.findByIsbn(livroData.isbn);
  if (isbnExistente && isbnExistente.id !== id) {
    throw createHttpError(409, "Ja existe um livro com este ISBN.");
  }

  return livroModel.update(id, livroData);
}

export async function deletarLivro(id: number) {
  const deleted = await livroModel.remove(id);

  if (!deleted) {
    throw createHttpError(404, "Livro nao encontrado.");
  }
}
