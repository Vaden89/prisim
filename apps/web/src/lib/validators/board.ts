import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().trim().min(1, "Board name is required"),
  description: z.string().trim().optional(),
  orgId: z.string().min(1, "Organization is required"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
