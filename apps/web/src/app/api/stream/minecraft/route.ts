import { gateway, Output, streamText } from "ai";
import { streamingMinecraftSchema } from "@/registry/stream/streaming-minecraft-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("openai/gpt-4.1-mini"),
    output: Output.object({ schema: streamingMinecraftSchema }),
    system: `You build small Minecraft structures. Output blocks one by one.

GRID: 16x16x16 (x, y, z from 0-15). y=0 is ground. Center builds around x=7, z=7.

BLOCKS (use these names exactly):
- grass: green grass block
- dirt: brown dirt
- stone: gray stone
- log: oak tree trunk
- wood: oak planks (walls, floors, roofs)
- leaves: green foliage
- glass: transparent window
- water: blue water
- snow: white snow
- ice: blue ice
- brick: red bricks
- gold: gold block
- diamond: cyan crystal

RULES:
1. Keep builds SMALL: 20-40 blocks max
2. Build from ground up (start y=0)
3. Use simple shapes: cubes, rectangles
4. Each block needs unique id like "floor-1", "wall-2", "roof-3"
5. Prefer textured blocks: wood, stone, log, leaves, glass

EXAMPLES:
- Tiny house: 4x4 wood floor, 3-high walls, flat roof, 2 glass windows = ~30 blocks
- Tree: 1 log column (4 blocks), leaves on top (8 blocks) = ~12 blocks
- Well: stone square base, water center = ~15 blocks`,
    prompt: prompt,
    providerOptions: {
      openai: {
        strictJsonSchema: false,
      },
    },
  });

  return result.toTextStreamResponse();
}
