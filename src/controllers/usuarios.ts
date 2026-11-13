import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as yup from "yup";
import { pool } from "../database";
import { paginar } from "../services/paginacao";

const router = express.Router();

// ESQUEMAS DE VALIDAÇÃO
const esquemaCadastro = yup.object({
  nome: yup.string().required("O nome é obrigatório").min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: yup.string().required("O e-mail é obrigatório").email("E-mail inválido"),
  senha: yup.string().required("A senha é obrigatória").min(6, "A senha deve ter no mínimo 6 caracteres"),
  situacao_id: yup.number().typeError("A situação deve ser um número").required("A situação é obrigatória").integer().positive(),
});

const esquemaEdicao = yup.object({
  nome: yup.string().required("O nome é obrigatório").min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: yup.string().required("O e-mail é obrigatório").email("E-mail inválido"),
  situacao_id: yup.number().typeError("A situação deve ser um número").required("A situação é obrigatória").integer().positive(),
});

// LISTAR usuários (com paginação)
router.get("/usuarios", async (req: Request, res: Response) => {
  try {
    const resultado = await paginar({
      sqlLista:
        "SELECT u.id, u.nome, u.email, s.nome_situacao FROM usuarios u JOIN situacoes s ON s.id = u.situacao_id ORDER BY u.id",
      sqlTotal: "SELECT COUNT(*) FROM usuarios",
      pagina: Number(req.query.pagina) || 1,
      limite: Number(req.query.limite) || 10,
    });
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar usuários" });
  }
});

// VISUALIZAR um usuário pelo id
router.get("/usuarios/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT u.id, u.nome, u.email, u.situacao_id FROM usuarios u WHERE u.id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
});

// CADASTRAR um usuário (com validação Yup)
router.post("/usuarios", async (req: Request, res: Response) => {
  try {
    await esquemaCadastro.validate(req.body, { abortEarly: false });
  } catch (err: any) {
    return res.status(400).json({ erros: err.errors });
  }

  try {
    const { nome, email, senha, situacao_id } = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha, situacao_id) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, situacao_id",
      [nome, email, senhaCriptografada, situacao_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ erro: "Esse e-mail já está cadastrado" });
    }
    if (err.code === "23503") {
      return res.status(400).json({ erro: "situacao_id não existe" });
    }
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

// EDITAR um usuário (com validação Yup)
router.put("/usuarios/:id", async (req: Request, res: Response) => {
  try {
    await esquemaEdicao.validate(req.body, { abortEarly: false });
  } catch (err: any) {
    return res.status(400).json({ erros: err.errors });
  }

  try {
    const { nome, email, situacao_id } = req.body;

    const result = await pool.query(
      "UPDATE usuarios SET nome = $1, email = $2, situacao_id = $3, atualizado_em = NOW() WHERE id = $4 RETURNING id, nome, email, situacao_id",
      [nome, email, situacao_id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ erro: "Esse e-mail já está em uso" });
    }
    if (err.code === "23503") {
      return res.status(400).json({ erro: "situacao_id não existe" });
    }
    res.status(500).json({ erro: "Erro ao editar usuário" });
  }
});

// APAGAR um usuário
router.delete("/usuarios/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json({ mensagem: "Usuário apagado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao apagar usuário" });
  }
});

export default router;