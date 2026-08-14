import { z } from "zod";

export const blastRadiusSchema = z.object({
  summary: z
    .string()
    .describe(
      "A short plain language summary of the change and it's overall blast radius.",
    ),
  subTasks: z
    .array(
      z.object({
        title: z
          .string()
          .describe(
            "A concise title for the sub-task, giving a brief overview of what needs to be done.",
          ),
        description: z
          .string()
          .describe(
            "Rich Markdown detailed summary of the affected context and what needs to be done: \n" +
              "- **Target**: `file` and `symbol` affected \n" +
              "- **Change Type**: `rename` | `behavior` | `signature` | `call-site-update` | `review` | `test` | `other` \n" +
              "- **Reasoning**: Casual chain explaining why this symbol is affected by the change \n" +
              "- **Suggested Edit**: A concrete suggested edit to fix the issue.",
          ),
      }),
    )
    .describe(
      "Concrete, ordered sub-tasks covering the full cascade of the change.",
    ),
});

export type BlastRadiusReport = z.infer<typeof blastRadiusSchema>;
