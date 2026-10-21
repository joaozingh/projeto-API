DROP TABLE produtos;

CREATE TABLE situacoes (
  id SERIAL PRIMARY KEY, 
  nome_situacao VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categorias_produto (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE situacoes_produto (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  situacao_id INT NOT NULL REFERENCES situacoes(id),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  situacao_produto_id INT NOT NULL REFERENCES situacoes_produto(id),
  categoria_id INT NOT NULL REFERENCES categorias_produto(id),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);