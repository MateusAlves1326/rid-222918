import type { NextFunction, Request, Response } from "express";

type HttpError = Error & { status?: number };

export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({ mensagem: "Rota nao encontrada." });
}

export function errorHandler(error: HttpError, req: Request, res: Response, next: NextFunction) {
  const status = error.status || 500;
  const mensagem = status === 500 ? "Erro interno do servidor." : error.message;

  if (status === 500) {
    console.error("Erro interno:", {
      message: error.message,
      stack: error.stack,
      cause: (error as Error & { cause?: unknown }).cause
    });
  }

  return res.status(status).json({ mensagem });
}
