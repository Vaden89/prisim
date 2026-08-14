import z from "zod";
import { embedQuery } from "./embed.js";
import { CodeChunk } from "../types/db.types.js";
import { AgentResult } from "../types/agent.types.js";
import { generateObject, generateText, stepCountIs, tool } from "ai";
import { blastRadiusSchema } from "../utils/validations/ai.schema.js";
import { cascade, dependenciesOf, dependentsOf, vectorSearch } from "./db.js";

let embeddingDone = false;

function buildTools() {
  return {
    searchCode: tool({
      description:
        "Semantic vector search over the indexed codebase. Returns the most relevant code chunks " +
        "(file, line range, code) for a natural language query. Call this ONCE with your best query; " +
        "embedding is heavily rate limited",
      inputSchema: z.object({
        query: z
          .string()
          .describe(
            "Natural language description of the code you want to find.",
          ),
        topK: z.number().int().max(15).default(8),
      }),
      execute: async ({
        query,
        topK,
      }): Promise<{ note?: string; results: CodeChunk[] }> => {
        if (embeddingDone) {
          return {
            note: "Embedding already used this run (rate limit). Reuse earlier searchCode results",
            results: [],
          };
        }

        embeddingDone = true;
        const vec = await embedQuery(query);
        const results = await vectorSearch(vec, topK);
        return { results };
      },
    }),

    getDependents: tool({
      description:
        "Given a symbol name, return functions that CALL it (it's dependents / callers). " +
        "These would break if the symbol changes. Use to walk the blast radius outwards.",
      inputSchema: z.object({
        symbol: z
          .string()
          .describe("The function/symbol name to find callers of."),
        cascadeDepth: z
          .number()
          .int()
          .min(1)
          .max(3)
          .default(1)
          .describe(
            "If >1, transitively follow callers-of-callers up to this depth.",
          ),
      }),
      execute: async ({ symbol, cascadeDepth }) => {
        if (cascadeDepth <= 1) {
          return { dependents: await dependentsOf(symbol) };
        }
        return { cascade: await cascade([symbol], cascadeDepth) };
      },
    }),

    getDependencies: tool({
      description:
        "Given a function name, return the symbols it CALLS (it's dependencies). " +
        "Use to understand what a function relies on.",
      inputSchema: z.object({
        fn: z.string().describe("The function name to inspect."),
      }),
      execute: async ({ fn }) => {
        return { dependencies: await dependenciesOf(fn) };
      },
    }),
  };
}

export async function blastRadiusAgent(task: string): Promise<AgentResult> {
  embeddingDone = false;

  const tools = buildTools();

  const systemPrompt = [
    "You are a code-impact ('blast radius') analyzer working over an indexed Typescript codebase.",
    "You have three tools:",
    " - seachCode: semantic vector search (RATE LIMITED: call at most ONCE).",
    " - getDependents: find callers of a symbol (who breaks if it changes). Supports cascadeDepth up to 3.",
    " - getDependencies: find what a function calls.",
    "",
    "Workflow:",
    "1. Reason about the task to identify the concrete code symbols/behaviors involved.",
    "2. Use searchCode ONCE to pull candidate affected code chunks.",
    "3. For each involved symbol, use getDependents (with cascadeDepth 2-3) to find the cascade of callers, and getDependencies where useful to understand what a function relies on.",
    "4. Reason about cascading changes: a renamed/changed symbol forces every caller to update, and whatever calls those callers may need review.",
    "When you have gathered enough context, stop calling tools and write a concise investigation summary",
    "naming the affected files, symbols, and the causal chain.",
  ].join("\n");

  const investigation = await generateText({
    model: "openai/gpt-5.4-mini",
    instructions: systemPrompt,
    prompt: `Task / change description: \n${task}\n Investigate the blast radius using your tools, then summarize your findings.`,
    tools,
    stopWhen: stepCountIs(10),
  });

  const { object: report } = await generateObject({
    model: "openai/gpt-5.4-mini",
    instructions: `
      You convert a blast-radius investigation into a structured report.
      Each sub-task must name the file, the symbol, the change type, why it is affected, and a concrete suggested edit.
      Order sub-tasks so the originally-changed symbol comes first, then its direct dependents, then transitive ones.
    `,
    prompt: investigation.text,
    schema: blastRadiusSchema,
  });

  return {
    investigation: investigation.text,
    report,
  };
}
