import { getDb } from "../database/connection";
import type { Livro, LivroPayload } from "../types/livro";

export async function findAll() {
  const db = await getDb();
  const result = await db.query<Livro>("SELECT id, titulo, numero_paginas, isbn, editora FROM livros ORDER BY id DESC");
  return result.rows;
}

export async function findById(id: number) {
  const db = await getDb();
  const result = await db.query<Livro>("SELECT id, titulo, numero_paginas, isbn, editora FROM livros WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function findByIsbn(isbn: string) {
  const db = await getDb();
  const result = await db.query<Livro>("SELECT id, titulo, numero_paginas, isbn, editora FROM livros WHERE isbn = $1", [isbn]);
  return result.rows[0] || null;
}

export async function create(livro: LivroPayload) {
  const db = await getDb();
  const result = await db.query<Livro>(
    "INSERT INTO livros (titulo, numero_paginas, isbn, editora) VALUES ($1, $2, $3, $4) RETURNING id, titulo, numero_paginas, isbn, editora",
    [livro.titulo, livro.numero_paginas, livro.isbn, livro.editora]
  );

  return result.rows[0] || null;
}

export async function update(id: number, livro: LivroPayload) {
  const db = await getDb();
  const result = await db.query<Livro>(
    "UPDATE livros SET titulo = $1, numero_paginas = $2, isbn = $3, editora = $4 WHERE id = $5 RETURNING id, titulo, numero_paginas, isbn, editora",
    [livro.titulo, livro.numero_paginas, livro.isbn, livro.editora, id]
  );

  return result.rows[0] || null;
}

export async function remove(id: number) {
  const db = await getDb();
  const result = await db.query("DELETE FROM livros WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
