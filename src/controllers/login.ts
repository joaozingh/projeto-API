//importar a biblioteca Express
import express, { Request, Response } from "express";
import { pool } from "../database";

// Criar a aplicação Express
const router = express.Router();

//Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
  res.send("será? que minha mulher vai me dar uma caveira de presente de hallowen ???????/");
});

//exportar a instrução da rota
export default router;