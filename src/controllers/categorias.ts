import express, { Request, Response } from "express";
import { pool } from "../database";

const router = express.Router();

router.get("/categorias", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT id, nome FROM categorias_produto ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar categorias" });
  }
});

router.get("/categorias/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT id, nome FROM categorias_produto WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: "Categoria não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar categoria" });
  }
});

router.post("/categorias", async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: "Informe nome" });
    const result = await pool.query(
      "INSERT INTO categorias_produto (nome) VALUES ($1) RETURNING id, nome",
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar categoria" });
  }
});

router.put("/categorias/:id", async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: "Informe nome" });
    const result = await pool.query(
      "UPDATE categorias_produto SET nome = $1, atualizado_em = NOW() WHERE id = $2 RETURNING id, nome",
      [nome, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: "Categoria não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao editar categoria" });
  }
});

router.delete("/categorias/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("DELETE FROM categorias_produto WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: "Categoria não encontrada" });
    res.json({ mensagem: "Categoria apagada com sucesso" });
  } catch (err: any) {
    console.error(err);
    if (err.code === "23503") {
      return res.status(409).json({ erro: "Categoria em uso por produtos, não pode ser apagada" });
    }
    res.status(500).json({ erro: "Erro ao apagar categoria" });
  }
});

export default router;