import { pool } from "../database";

async function rodarSeed() {
  try {
    // Só insere se a tabela estiver vazia
    const sit = await pool.query("SELECT COUNT(*) FROM situacoes");
    if (Number(sit.rows[0].count) === 0) {
      await pool.query("INSERT INTO situacoes (nome_situacao) VALUES ('Ativo'), ('Inativo')");
      console.log("Seed: situacoes criadas");
    }

    const sitProd = await pool.query("SELECT COUNT(*) FROM situacoes_produto");
    if (Number(sitProd.rows[0].count) === 0) {
      await pool.query("INSERT INTO situacoes_produto (nome) VALUES ('Disponível'), ('Esgotado')");
      console.log("Seed: situacoes_produto criadas");
    }

    const cat = await pool.query("SELECT COUNT(*) FROM categorias_produto");
    if (Number(cat.rows[0].count) === 0) {
      await pool.query("INSERT INTO categorias_produto (nome) VALUES ('Eletrônicos'), ('Roupas')");
      console.log("Seed: categorias_produto criadas");
    }

    console.log("Seed finalizado!");
  } catch (err) {
    console.error("Erro no seed:", err);
  } finally {
    await pool.end();
  }
}

rodarSeed();