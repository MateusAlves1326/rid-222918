import type { NextFunction, Request, Response } from "express";

export function validateLivroPayload(req: Request, res: Response, next: NextFunction) {
  const { titulo, numero_paginas, isbn, editora } = req.body;

  if (!titulo || typeof titulo !== "string" || !titulo.trim()) {
    return res.status(400).json({ mensagem: "Campo 'titulo' e obrigatorio." });
  }

  if (!Number.isInteger(numero_paginas) || numero_paginas <= 0) {
    return res.status(400).json({ mensagem: "Campo 'numero_paginas' deve ser inteiro positivo." });
  }

  if (!isbn || typeof isbn !== "string" || !isbn.trim()) {
    return res.status(400).json({ mensagem: "Campo 'isbn' e obrigatorio." });
  }

  if (!editora || typeof editora !== "string" || !editora.trim()) {
    return res.status(400).json({ mensagem: "Campo 'editora' e obrigatorio." });
  }

  req.body = {
    titulo: titulo.trim(),
    numero_paginas,
    isbn: isbn.trim(),
    editora: editora.trim()
  };

  return next();
}
