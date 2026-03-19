import type { Config, Context } from "@netlify/functions";
import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = Netlify.env.get("NETLIFY_DATABASE_URL");
    if (!connectionString) {
      throw new Error("NETLIFY_DATABASE_URL is not set");
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

async function ensureTable() {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS livros (
      id SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL,
      numero_paginas INTEGER NOT NULL,
      isbn TEXT NOT NULL UNIQUE,
      editora TEXT NOT NULL
    );
  `);
}

let migrated = false;

async function ensureMigrated() {
  if (!migrated) {
    await ensureTable();
    migrated = true;
  }
}

function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function errorResponse(message: string, status: number) {
  return Response.json({ mensagem: message }, { status });
}

// GET /api/livros
async function getLivros() {
  await ensureMigrated();
  const db = getPool();
  const result = await db.query(
    "SELECT id, titulo, numero_paginas, isbn, editora FROM livros ORDER BY id DESC"
  );
  return jsonResponse(result.rows);
}

// GET /api/livros/:id
async function getLivroById(id: number) {
  await ensureMigrated();
  const db = getPool();
  const result = await db.query(
    "SELECT id, titulo, numero_paginas, isbn, editora FROM livros WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) {
    return errorResponse("Livro nao encontrado.", 404);
  }
  return jsonResponse(result.rows[0]);
}

// POST /api/livros
async function createLivro(body: {
  titulo: string;
  numero_paginas: number;
  isbn: string;
  editora: string;
}) {
  await ensureMigrated();
  const db = getPool();

  const existing = await db.query("SELECT id FROM livros WHERE isbn = $1", [
    body.isbn,
  ]);
  if (existing.rows.length > 0) {
    return errorResponse("Ja existe um livro com este ISBN.", 409);
  }

  const result = await db.query(
    "INSERT INTO livros (titulo, numero_paginas, isbn, editora) VALUES ($1, $2, $3, $4) RETURNING id, titulo, numero_paginas, isbn, editora",
    [body.titulo, body.numero_paginas, body.isbn, body.editora]
  );
  return jsonResponse(result.rows[0], 201);
}

// PUT /api/livros/:id
async function updateLivro(
  id: number,
  body: {
    titulo: string;
    numero_paginas: number;
    isbn: string;
    editora: string;
  }
) {
  await ensureMigrated();
  const db = getPool();

  const current = await db.query("SELECT id FROM livros WHERE id = $1", [id]);
  if (current.rows.length === 0) {
    return errorResponse("Livro nao encontrado.", 404);
  }

  const isbnCheck = await db.query(
    "SELECT id FROM livros WHERE isbn = $1 AND id != $2",
    [body.isbn, id]
  );
  if (isbnCheck.rows.length > 0) {
    return errorResponse("Ja existe um livro com este ISBN.", 409);
  }

  const result = await db.query(
    "UPDATE livros SET titulo = $1, numero_paginas = $2, isbn = $3, editora = $4 WHERE id = $5 RETURNING id, titulo, numero_paginas, isbn, editora",
    [body.titulo, body.numero_paginas, body.isbn, body.editora, id]
  );
  return jsonResponse(result.rows[0]);
}

// DELETE /api/livros/:id
async function deleteLivro(id: number) {
  await ensureMigrated();
  const db = getPool();

  const result = await db.query("DELETE FROM livros WHERE id = $1", [id]);
  if ((result.rowCount ?? 0) === 0) {
    return errorResponse("Livro nao encontrado.", 404);
  }
  return jsonResponse({ mensagem: "Livro removido com sucesso." });
}

function validateLivroPayload(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return "Corpo da requisicao invalido.";
  }
  const b = body as Record<string, unknown>;
  if (!b.titulo || typeof b.titulo !== "string" || b.titulo.trim() === "") {
    return "O campo 'titulo' e obrigatorio e deve ser um texto.";
  }
  if (
    b.numero_paginas === undefined ||
    typeof b.numero_paginas !== "number" ||
    b.numero_paginas < 1
  ) {
    return "O campo 'numero_paginas' e obrigatorio e deve ser um numero positivo.";
  }
  if (!b.isbn || typeof b.isbn !== "string" || b.isbn.trim() === "") {
    return "O campo 'isbn' e obrigatorio e deve ser um texto.";
  }
  if (!b.editora || typeof b.editora !== "string" || b.editora.trim() === "") {
    return "O campo 'editora' e obrigatorio e deve ser um texto.";
  }
  return null;
}

function validateId(idStr: string | undefined): number | null {
  if (!idStr) return null;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;

  // Parse the path: expect /api/livros or /api/livros/:id
  const pathParts = url.pathname
    .replace(/^\/\.netlify\/functions\/api/, "")
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean);

  // Health check
  if (pathParts[0] === "health") {
    return jsonResponse({ status: "ok" });
  }

  // Only handle /livros routes
  if (pathParts[0] !== "livros") {
    return errorResponse("Rota nao encontrada.", 404);
  }

  const idParam = pathParts[1];

  try {
    // GET /api/livros
    if (method === "GET" && !idParam) {
      return await getLivros();
    }

    // GET /api/livros/:id
    if (method === "GET" && idParam) {
      const id = validateId(idParam);
      if (!id) return errorResponse("ID invalido.", 400);
      return await getLivroById(id);
    }

    // POST /api/livros
    if (method === "POST" && !idParam) {
      const body = await req.json();
      const validationError = validateLivroPayload(body);
      if (validationError) return errorResponse(validationError, 400);
      return await createLivro(
        body as {
          titulo: string;
          numero_paginas: number;
          isbn: string;
          editora: string;
        }
      );
    }

    // PUT /api/livros/:id
    if (method === "PUT" && idParam) {
      const id = validateId(idParam);
      if (!id) return errorResponse("ID invalido.", 400);
      const body = await req.json();
      const validationError = validateLivroPayload(body);
      if (validationError) return errorResponse(validationError, 400);
      return await updateLivro(
        id,
        body as {
          titulo: string;
          numero_paginas: number;
          isbn: string;
          editora: string;
        }
      );
    }

    // DELETE /api/livros/:id
    if (method === "DELETE" && idParam) {
      const id = validateId(idParam);
      if (!id) return errorResponse("ID invalido.", 400);
      return await deleteLivro(id);
    }

    return errorResponse("Metodo nao permitido.", 405);
  } catch (error) {
    console.error("API error:", error);
    return errorResponse("Erro interno do servidor.", 500);
  }
};

export const config: Config = {
  path: ["/api/*"],
};
