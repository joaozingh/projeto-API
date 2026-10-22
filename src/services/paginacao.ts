import { pool } from "../database";

interface OpcoesPaginacao {
  sqlLista: string;     // SELECT dos registros (sem LIMIT/OFFSET)
  sqlTotal: string;     // SELECT COUNT(*) da mesma tabela
  pagina: number;
  limite: number;
}

export async function paginar({ sqlLista, sqlTotal, pagina, limite }: OpcoesPaginacao) {
  const paginaOk = pagina > 0 ? pagina : 1;
  const limiteOk = limite > 0 && limite <= 100 ? limite : 10;
  const offset = (paginaOk - 1) * limiteOk;

  const total = await pool.query(sqlTotal);
  const totalRegistros = Number(total.rows[0].count);

  const lista = await pool.query(`${sqlLista} LIMIT $1 OFFSET $2`, [limiteOk, offset]);

  return {
    dados: lista.rows,
    paginaAtual: paginaOk,
    limite: limiteOk,
    totalRegistros,
    totalPaginas: Math.ceil(totalRegistros / limiteOk),
  };
}