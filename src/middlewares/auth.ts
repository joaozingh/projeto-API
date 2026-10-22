import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho) {
    return res.status(401).json({ erro: "Token não informado" });
  }

  // O formato é: "Bearer <token>"
  const token = cabecalho.split(" ")[1];

  try {
    jwt.verify(token as string, process.env.JWT_SECRET as string);
    next(); // token válido, deixa passar
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}