import { gateway, Output, streamText } from "ai";
import { streamingChartSchema } from "@/registry/stream/streaming-chart-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("openai/gpt-4.1-mini"),
    output: Output.object({ schema: streamingChartSchema }),
    system: `You are a data visualization generator. Generate realistic chart data based on the user's request.
Always include:
- title: A short descriptive title for the chart
- value: The current/highlighted value (a realistic number)
- unit: The unit prefix (e.g., "$", "€", "" for counts)
- change: Percentage change vs previous period (can be negative)
- changeLabel: Context for the change (e.g., "vs. last quarter", "vs. last month")
- data: An array of 8-12 data points with:
  - label: Short label (e.g., "Jan", "Feb", "Q1", "Week 1")
  - value: Numeric value (realistic for the context)

Make the data realistic with natural variance. Include both growth and decline patterns when appropriate.
The value should typically be the most recent data point or a meaningful aggregate.`,
    prompt: `Generate chart data for: ${prompt}`,
    providerOptions: {
      openai: {
        strictJsonSchema: false,
      },
    },
  });

  return result.toTextStreamResponse();
}
