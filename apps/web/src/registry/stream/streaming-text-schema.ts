import { z } from "zod";

export const streamingTextSchema = z.object({
  text: z.string().describe("The response text"),
});

export type StreamingTextData = z.infer<typeof streamingTextSchema>;

