export interface Livro {
  id: number;
  titulo: string;
  numero_paginas: number;
  isbn: string;
  editora: string;
}

export type LivroPayload = Omit<Livro, "id">;
