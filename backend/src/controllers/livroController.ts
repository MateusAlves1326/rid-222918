import type { NextFunction, Request, Response } from "express";
import * as livroService from "../services/livroService";

export async function getLivros(req: Request, res: Response, next: NextFunction) {
  try {
    const livros = await livroService.listarLivros();
    return res.status(200).json(livros);
  } catch (error) {
    return next(error);
  }
}

export async function getLivroById(req: Request, res: Response, next: NextFunction) {
  try {
    const livro = await livroService.buscarLivroPorId(Number(req.params.id));
    return res.status(200).json(livro);
  } catch (error) {
    return next(error);
  }
}

export async function createLivro(req: Request, res: Response, next: NextFunction) {
  try {
    const livro = await livroService.criarLivro(req.body);
    return res.status(201).json(livro);
  } catch (error) {
    return next(error);
  }
}

export async function updateLivro(req: Request, res: Response, next: NextFunction) {
  try {
    const livro = await livroService.atualizarLivro(Number(req.params.id), req.body);
    return res.status(200).json(livro);
  } catch (error) {
    return next(error);
  }
}

export async function deleteLivro(req: Request, res: Response, next: NextFunction) {
  try {
    await livroService.deletarLivro(Number(req.params.id));
    return res.status(200).json({ mensagem: "Livro removido com sucesso." });
  } catch (error) {
    return next(error);
  }
}
