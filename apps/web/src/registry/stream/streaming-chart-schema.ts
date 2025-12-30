import { z } from "zod";

export const streamingChartSchema = z.object({
  title: z.string().describe("Chart title (e.g., 'Revenue', 'Users')"),
  value: z.number().describe("Current highlighted value"),
  unit: z.string().describe("Value unit (e.g., '$', '€', 'users')"),
  change: z.number().describe("Percentage change vs previous period"),
  changeLabel: z.string().describe("Label for change (e.g., 'vs. last quarter')"),
  data: z
    .array(
      z.object({
        label: z.string().describe("X-axis label (e.g., 'Jan', 'Feb')"),
        value: z.number().describe("Bar value"),
      }),
    )
    .describe("Chart data points"),
});

export type StreamingChartData = z.infer<typeof streamingChartSchema>;

