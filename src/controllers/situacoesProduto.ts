import express, { Request, Response } from "express";
import { pool } from "../database";

const router = express.Router();

router.get("/situacoes-produto", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT id, nome FROM situacoes_produto ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar situações de produto" });
  }
});

router.get("/situacoes-produto/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT id, nome FROM situacoes_produto WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: "Situação de produto não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar situação de produto" });
  }
});

router.post("/situacoes-produto", async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: "Informe nome" });
    const result = await pool.query(
      "INSERT INTO situacoes_produto (nome) VALUES ($1) RETURNING id, nome",
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar situação de produto" });
  }
});

router.put("/situacoes-produto/:id", async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: "Informe nome" });
    const result = await pool.query(
      "UPDATE situacoes_produto SET nome = $1, atualizado_em = NOW() WHERE id = $2 RETURNING id, nome",
      [nome, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: "Situação de produto não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao editar situação de produto" });
  }
});

router.delete("/situacoes-produto/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("DELETE FROM situacoes_produto WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: "Situação de produto não encontrada" });
    res.json({ mensagem: "Situação de produto apagada com sucesso" });
  } catch (err: any) {
    console.error(err);
    if (err.code === "23503") {
      return res.status(409).json({ erro: "Situação em uso por produtos, não pode ser apagada" });
    }
    res.status(500).json({ erro: "Erro ao apagar situação de produto" });
  }
});

export default router;