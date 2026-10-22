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

//criar rotas
app.use('/', login);
app.use('/', usuarios);
app.use('/', produtos);
app.use('/', situacoes);
app.use('/', categorias);
app.use('/', situacoesProduto);

// Iniciar o servidor na porta 8080
app.listen(8080, () => {
  console.log("servidor iniciado na porta 8080: http://localhost:8080");
});