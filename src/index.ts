//imporrtar a biblioteca Express 
import express from "express";

import "./database";


// Criar a aplicação Express
const app = express();

//incluir os controllers 
import login from"./controllers/login";

//criar rotas
app.use('/', login)

// Iniciar o servidor na porta 8080
app.listen(8080, ()=>{
    console.log("servidor iniciado na porta 8080: http://localhost:8080");
});