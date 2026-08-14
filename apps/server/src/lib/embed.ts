const VOYAGE_ENDPOINT = "https://api.voyageai.com/v1/embeddings";
const MODEL = "voyage-code-4";
const EXPECTED_DIM = 1024;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function embedQuery(query: string): Promise<number[]> {
  const voyageApiKey = process.env["VOYAGE_API_KEY"];

  if (!voyageApiKey) {
    throw new Error("VOYAGE_API_KEY not set");
  }

  const maxRetries = 2;
  const waitTime = 22_000; // in ms

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(VOYAGE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${voyageApiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          input: [query],
          input_type: "query",
        }),
      });

      if (res.status === 429) {
        if (attempt < maxRetries) {
          console.error(
            `Voyage rate limit. Waiting ${waitTime / 1000}s before retry ${attempt + 1}/${maxRetries}`,
          );
          await sleep(waitTime);
          continue;
        }
        throw new Error("Voyage rate limit exceeded");
      }

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Voyage embeddings failed [${res.status}]: ${body}`);
      }

      const json = (await res.json()) as {
        data?: Array<{ embedding: number[] }>;
      };

      const embedding = json.data?.[0]?.embedding;

      if (!embedding)
        throw new Error("Voyage response contained no embeddings");

      if (embedding.length !== EXPECTED_DIM)
        throw new Error(
          `Voyage returned ${embedding.length} dims, expected ${EXPECTED_DIM}`,
        );

      return embedding;
    } catch (err) {
      const isConnectionError =
        err instanceof TypeError ||
        (err instanceof Error &&
          /fetch failed|ECONN|network/i.test(err.message));

      if (isConnectionError && attempt < maxRetries) {
        console.error(
          `CONNECTION ERROR, Waiting ${waitTime / 1000}s before retry ${attempt + 1}/${maxRetries}`,
        );

        await sleep(waitTime);
        continue;
      }

      throw err;
    }
  }

  throw new Error("Voyage embedding failed after retries.");
}
