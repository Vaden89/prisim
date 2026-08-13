import pg from "pg";
import { CascadeNode, CodeChunk, Dependent } from "../types/db.types.js";

const { Pool } = pg;

const POSTGRES_URL = process.env["POSTGRES_URL"];

const pool = new Pool({ connectionString: POSTGRES_URL });

export const vectorSearch = async (
  queryEmbedding: number[],
  topK = 8,
): Promise<CodeChunk[]> => {
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;
  const res = await pool.query(
    `SELECT filename, start_line, end_line, code,
      1 - (embedding <=> $1::vector) AS similarity
    FROM code_embeddings
    ORDER BY embedding <=> $1::vector
    LIMIT $2`,
    [vectorLiteral, topK],
  );

  return res.rows.map((r) => ({
    filename: r.filename,
    startLine: r.start_line,
    endLine: r.end_line,
    code: r.code,
    similarity: Number(r.similarity),
  }));
};

export const dependentsOf = async (symbol: string): Promise<Dependent[]> => {
  const result = await pool.query(
    `SELECT DISTINCT caller_file, caller_name, line_number
    FROM code_call_edges
    WHERE callee_name = $1`,
    [symbol],
  );

  return result.rows.map((r) => ({
    callerFile: r.caller_file,
    callerName: r.caller_name,
    lineNumber: Number(r.line_number),
  }));
};

export async function dependenciesOf(fn: string): Promise<string[]> {
  const result = await pool.query(
    `SELECT DISTINCT callee_name
    FROM code_call_edges
    WHERE caller_name = $1`,
    [fn],
  );

  return result.rows.map((r) => r.callee_name as string);
}

export const cascade = async (
  seeds: string[],
  maxDepth = 3,
): Promise<CascadeNode[]> => {
  const visited = new Set<string>();
  const nodes: CascadeNode[] = [];

  let frontier = [...new Set(seeds)];
  let depth = 0;

  while (frontier.length > 0 && depth < maxDepth) {
    const nextFrontier: string[] = [];
    for (const symbol of frontier) {
      if (visited.has(symbol)) continue;
      visited.add(symbol);
      const dependents = await dependentsOf(symbol);
      nodes.push({ symbol, depth, dependents });
      for (const d of dependents) {
        if (!visited.has(d.callerName)) nextFrontier.push(d.callerName);
      }
    }
    frontier = [...new Set(nextFrontier)];
    depth++;
  }

  return nodes;
};

export async function countEmbeddings(): Promise<number> {
  const res = await pool.query(
    `SELECT count(*)::int AS n FROM code_embeddings`,
  );
  return res.rows[0].n as number;
}

export async function closePool(): Promise<void> {
  await pool.end();
}
