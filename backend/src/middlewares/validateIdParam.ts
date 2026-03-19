import type { NextFunction, Request, Response } from "express";

export function validateIdParam(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: "ID invalido. Informe um numero inteiro positivo." });
  }

  req.params.id = String(id);
  return next();
}
