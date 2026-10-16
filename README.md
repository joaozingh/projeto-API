Compilar o arquivo typescript 

npx.tsc

node dist/index.js
...
compilar o typescript

rodar o projeto: 
npm run start:watch
....

comando para entrar no postgres: 
psql -U postgres 

entrar direto no projeto_api: 
psql -U postgres -d projeto_api

o INT REFERENCES é um relacionamento no sql 
exemplo: situacoes_produto_id INT REFERENCES situacoes_produto(id)