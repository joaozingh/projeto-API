//importar a biblioteca Express
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database";

// Criar a aplicação Express
const router = express.Router();

//Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
  res.send("será? que minha mulher vai me dar uma caveira de presente de hallowen ???????/");
});

// LOGIN (rota pública)
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Informe email e senha" });
    }

    const result = await pool.query(
      "SELECT id, nome, email, senha, situacao_id FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos" });
    }

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});

//exportar a instrução da rota
export default router;