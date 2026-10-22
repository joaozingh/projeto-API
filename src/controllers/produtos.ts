import express, { Request, Response } from "express";
import { pool } from "../database";

const router = express.Router();

// LISTAR todos os produtos (com nome da categoria e da situação)
router.get("/produtos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.nome, c.nome AS categoria, sp.nome AS situacao
       FROM produtos p
       JOIN categorias_produto c ON c.id = p.categoria_id
       JOIN situacoes_produto sp ON sp.id = p.situacao_produto_id
       ORDER BY p.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar produtos" });
  }
});

// VISUALIZAR um produto pelo id
router.get("/produtos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, situacao_produto_id, categoria_id FROM produtos WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar produto" });
  }
});

// CADASTRAR um produto
router.post("/produtos", async (req: Request, res: Response) => {
  try {
    const { nome, situacao_produto_id, categoria_id } = req.body;

    if (!nome || !situacao_produto_id || !categoria_id) {
      return res
        .status(400)
        .json({ erro: "Preencha nome, situacao_produto_id e categoria_id" });
    }

    const result = await pool.query(
      "INSERT INTO produtos (nome, situacao_produto_id, categoria_id) VALUES ($1, $2, $3) RETURNING id, nome, situacao_produto_id, categoria_id",
      [nome, situacao_produto_id, categoria_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === "23503") {
      return res
        .status(400)
        .json({ erro: "situacao_produto_id ou categoria_id não existe" });
    }
    res.status(500).json({ erro: "Erro ao cadastrar produto" });
  }
});

// EDITAR um produto
router.put("/produtos/:id", async (req: Request, res: Response) => {
  try {
    const { nome, situacao_produto_id, categoria_id } = req.body;

    if (!nome || !situacao_produto_id || !categoria_id) {
      return res
        .status(400)
        .json({ erro: "Preencha nome, situacao_produto_id e categoria_id" });
    }

    const result = await pool.query(
      "UPDATE produtos SET nome = $1, situacao_produto_id = $2, categoria_id = $3, atualizado_em = NOW() WHERE id = $4 RETURNING id, nome, situacao_produto_id, categoria_id",
      [nome, situacao_produto_id, categoria_id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === "23503") {
      return res
        .status(400)
        .json({ erro: "situacao_produto_id ou categoria_id não existe" });
    }
    res.status(500).json({ erro: "Erro ao editar produto" });
  }
});

// APAGAR um produto
router.delete("/produtos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM produtos WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }
    res.json({ mensagem: "Produto apagado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao apagar produto" });
  }
});

export default router;