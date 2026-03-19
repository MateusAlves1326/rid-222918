const base = "http://localhost:3000";
const results = [];

async function req(path, opts) {
  const response = await fetch(`${base}${path}`, opts);
  const text = await response.text();

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  return { status: response.status, body };
}

function addResult(name, condition, details) {
  results.push({ name, ok: Boolean(condition), details });
}

async function main() {
  const uniqueIsbn = `isbn-${Date.now()}`;

  const health = await req("/health");
  addResult("GET /health -> 200", health.status === 200, health);

  const list = await req("/livros");
  addResult("GET /livros -> 200 + array", list.status === 200 && Array.isArray(list.body), {
    status: list.status,
    count: Array.isArray(list.body) ? list.body.length : null
  });

  const invalidId = await req("/livros/abc");
  addResult("GET /livros/:id invalido -> 400", invalidId.status === 400, invalidId);

  const notFound = await req("/livros/999999");
  addResult("GET /livros/:id inexistente -> 404", notFound.status === 404, notFound);

  const createPayload = {
    titulo: "Livro Teste Rotas",
    numero_paginas: 123,
    isbn: uniqueIsbn,
    editora: "Editora Teste"
  };

  const created = await req("/livros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createPayload)
  });
  addResult("POST /livros -> 201", created.status === 201 && created.body && created.body.id, created);

  const duplicate = await req("/livros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createPayload)
  });
  addResult("POST /livros ISBN duplicado -> 409", duplicate.status === 409, duplicate);

  const createdId = created.body?.id;

  const byId = await req(`/livros/${createdId}`);
  addResult("GET /livros/:id criado -> 200", byId.status === 200 && byId.body?.id === createdId, byId);

  const invalidUpdate = await req(`/livros/${createdId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "", numero_paginas: 0, isbn: "", editora: "" })
  });
  addResult("PUT /livros/:id payload invalido -> 400", invalidUpdate.status === 400, invalidUpdate);

  const updatePayload = {
    titulo: "Livro Atualizado",
    numero_paginas: 456,
    isbn: uniqueIsbn,
    editora: "Editora Nova"
  };

  const updated = await req(`/livros/${createdId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatePayload)
  });
  addResult("PUT /livros/:id -> 200", updated.status === 200 && updated.body?.titulo === "Livro Atualizado", updated);

  const deleted = await req(`/livros/${createdId}`, { method: "DELETE" });
  addResult("DELETE /livros/:id -> 200", deleted.status === 200, deleted);

  const deletedAgain = await req(`/livros/${createdId}`, { method: "DELETE" });
  addResult("DELETE /livros/:id inexistente -> 404", deletedAgain.status === 404, deletedAgain);

  const unknownRoute = await req("/rota-inexistente");
  addResult("GET /rota-inexistente -> 404", unknownRoute.status === 404, unknownRoute);

  const passed = results.filter((item) => item.ok).length;
  const failed = results.filter((item) => !item.ok).length;

  console.log(JSON.stringify({ passed, failed, results }, null, 2));

  if (failed > 0) {
    globalThis.process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  globalThis.process.exit(1);
});
