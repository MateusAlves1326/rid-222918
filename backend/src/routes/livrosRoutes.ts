import { Router } from "express";
import {
  getLivros,
  getLivroById,
  createLivro,
  updateLivro,
  deleteLivro
} from "../controllers/livroController";
import { validateIdParam } from "../middlewares/validateIdParam";
import { validateLivroPayload } from "../middlewares/validateLivroPayload";

const router = Router();

router.get("/", getLivros);
router.get("/:id", validateIdParam, getLivroById);
router.post("/", validateLivroPayload, createLivro);
router.put("/:id", validateIdParam, validateLivroPayload, updateLivro);
router.delete("/:id", validateIdParam, deleteLivro);

export default router;
