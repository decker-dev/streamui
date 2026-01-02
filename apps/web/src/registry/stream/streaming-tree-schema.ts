import { z } from "zod";

const baseTreeNode = z.object({
  id: z.string().describe("Unique identifier for the node"),
  label: z.string().describe("Display label for the node"),
  icon: z
    .string()
    .optional()
    .describe("Optional icon identifier (e.g., 'folder', 'file', 'user')"),
  description: z
    .string()
    .optional()
    .describe("Optional description or metadata"),
});

export type StreamingTreeNode = z.infer<typeof baseTreeNode> & {
  children?: StreamingTreeNode[];
};

export const streamingTreeNodeSchema: z.ZodType<StreamingTreeNode> =
  baseTreeNode.extend({
    children: z.lazy(() => z.array(streamingTreeNodeSchema)).optional(),
  });

export const streamingTreeSchema = z.object({
  title: z.string().optional().describe("Optional tree title"),
  nodes: z.array(streamingTreeNodeSchema).describe("Root level tree nodes"),
});

export type StreamingTreeData = z.infer<typeof streamingTreeSchema>;
