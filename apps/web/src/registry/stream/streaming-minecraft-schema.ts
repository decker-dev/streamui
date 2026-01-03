import { z } from "zod";

export const minecraftBlockSchema = z.object({
  id: z.string().describe("Unique identifier like 'wall-1' or 'roof-3'"),
  x: z.number().min(0).max(15).describe("X position (0-15)"),
  y: z.number().min(0).max(15).describe("Y height (0=ground)"),
  z: z.number().min(0).max(15).describe("Z depth (0-15)"),
  type: z
    .enum([
      // Textured blocks (preferred)
      "grass",
      "dirt",
      "stone",
      "log",
      "wood",
      "leaves",
      "glass",
      // Simple color blocks
      "water",
      "snow",
      "ice",
      "brick",
      "gold",
      "diamond",
    ])
    .describe("Block type"),
});

export const streamingMinecraftSchema = z.object({
  name: z.string().describe("Short name for the build"),
  blocks: z.array(minecraftBlockSchema).describe("Blocks to place"),
});

export type MinecraftBlock = z.infer<typeof minecraftBlockSchema>;
export type StreamingMinecraftData = z.infer<typeof streamingMinecraftSchema>;
