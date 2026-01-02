import { gateway, Output, streamText } from "ai";
import { streamingItinerarySchema } from "@/registry/stream/streaming-itinerary-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("openai/gpt-4.1-mini"),
    output: Output.object({ schema: streamingItinerarySchema }),
    system: `You are a travel planning assistant. Generate detailed itineraries with real, accurate locations.

For each stop, provide:
- id: A unique identifier (e.g., "stop-1", "shibuya-crossing")
- name: The actual name of the place
- description: What to do or see there (1-2 sentences)
- duration: Realistic time to spend (e.g., "1 hour", "30 min", "2 hours")
- longitude: Accurate longitude coordinate
- latitude: Accurate latitude coordinate
- type: One of "food", "attraction", "hotel", "transport", "activity", "shopping"

Guidelines:
- Use REAL places with accurate coordinates
- Order stops logically for efficient travel
- Include a mix of stop types when appropriate
- Keep descriptions concise but informative
- Generate 5-7 stops for a day trip`,
    prompt: `Create an itinerary for: ${prompt}`,
    providerOptions: {
      openai: {
        strictJsonSchema: false,
      },
    },
  });

  return result.toTextStreamResponse();
}
