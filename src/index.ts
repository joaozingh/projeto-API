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

//criar rotas
app.use('/', login);
app.use('/', usuarios);

// Iniciar o servidor na porta 8080
app.listen(8080, () => {
  console.log("servidor iniciado na porta 8080: http://localhost:8080");
});