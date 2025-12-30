import { gateway, Output, streamText } from "ai";
import { streamingTextSchema } from "@/registry/stream/streaming-text-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("openai/gpt-4.1-mini"),
    output: Output.object({ schema: streamingTextSchema }),
    system: `You are a helpful assistant. Keep responses concise and friendly. 
Respond in 2-3 sentences max unless the user asks for more detail.
Return your response in the text field.`,
    prompt,
    providerOptions: {
      openai: {
        strictJsonSchema: false,
      },
    },
  });

  return result.toTextStreamResponse();
}
