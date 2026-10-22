import express, { Request, Response } from "express";
import { pool } from "../database";

const router = express.Router();

router.get("/situacoes", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT id, nome_situacao FROM situacoes ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar situações" });
  }
});

router.get("/situacoes/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT id, nome_situacao FROM situacoes WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: "Situação não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar situação" });
  }
});

router.post("/situacoes", async (req: Request, res: Response) => {
  try {
    const { nome_situacao } = req.body;
    if (!nome_situacao) return res.status(400).json({ erro: "Informe nome_situacao" });
    const result = await pool.query(
      "INSERT INTO situacoes (nome_situacao) VALUES ($1) RETURNING id, nome_situacao",
      [nome_situacao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar situação" });
  }
});

router.put("/situacoes/:id", async (req: Request, res: Response) => {
  try {
    const { nome_situacao } = req.body;
    if (!nome_situacao) return res.status(400).json({ erro: "Informe nome_situacao" });
    const result = await pool.query(
      "UPDATE situacoes SET nome_situacao = $1, atualizado_em = NOW() WHERE id = $2 RETURNING id, nome_situacao",
      [nome_situacao, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: "Situação não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao editar situação" });
  }
});

router.delete("/situacoes/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("DELETE FROM situacoes WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: "Situação não encontrada" });
    res.json({ mensagem: "Situação apagada com sucesso" });
  } catch (err: any) {
    console.error(err);
    if (err.code === "23503") {
      return res.status(409).json({ erro: "Situação em uso por usuários, não pode ser apagada" });
    }
    res.status(500).json({ erro: "Erro ao apagar situação" });
  }
});

export default router;