import { gateway, Output, streamText } from "ai";
import { streamingTreeSchema } from "@/registry/stream/streaming-tree-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("openai/gpt-4.1-mini"),
    output: Output.object({ schema: streamingTreeSchema }),
    system: `You are a file structure generator. Generate realistic file/folder tree structures based on the user's request.

For each node include:
- id: A unique identifier (e.g., "src", "src/components", "src/components/button")
- label: The file or folder name (e.g., "src", "components", "Button.tsx")
- icon: One of "folder", "file", "file-code", "file-text", "image", "user", "settings" (optional, defaults based on content type)
- description: A brief description of what the file/folder contains (optional, keep very short)
- children: Array of child nodes (for folders only)

Guidelines:
- Use realistic naming conventions for the technology stack
- Include common files like README.md, package.json, tsconfig.json where appropriate
- Structure should be practical and follow best practices
- Keep the tree focused (10-25 nodes total)
- Use "file-code" for .ts, .tsx, .js, .jsx files
- Use "file-text" for .md, .txt, .json files
- Use "image" for image files
- Use "folder" for directories`,
    prompt: `Generate a file structure for: ${prompt}`,
    providerOptions: {
      openai: {
        strictJsonSchema: false,
      },
    },
  });

  return result.toTextStreamResponse();
}
