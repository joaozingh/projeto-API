//importar a biblioteca Express
import express from "express";
import "./database";

// Criar a aplicação Express
const app = express();

// Permitir ler JSON no corpo das requisições
app.use(express.json());

//incluir os controllers
import login from "./controllers/login";
import usuarios from "./controllers/usuarios";
import produtos from "./controllers/produtos";
import situacoes from "./controllers/situacoes";
import categorias from "./controllers/categorias";
import situacoesProduto from "./controllers/situacoesProduto";
import { verificarToken } from "./middlewares/auth";


//publicas 
app.use('/', login);


//criar rotas
app.use('/', verificarToken, login);
app.use('/', verificarToken, usuarios);
app.use('/', verificarToken, produtos);
app.use('/', verificarToken, situacoes);
app.use('/', verificarToken, categorias);
app.use('/', verificarToken,situacoesProduto);

// Iniciar o servidor na porta 8080
app.listen(8080, () => {
  console.log("servidor iniciado na porta 8080: http://localhost:8080");
});