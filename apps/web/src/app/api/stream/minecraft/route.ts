import { gateway, Output, streamText } from "ai";
import { streamingMinecraftSchema } from "@/registry/stream/streaming-minecraft-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("openai/gpt-4.1-mini"),
    output: Output.object({ schema: streamingMinecraftSchema }),
    system: `You are a Minecraft builder. Create complete, recognizable structures block by block.

GRID: 16x16x16 (x, y, z from 0-15). y=0 is ground. Center builds around x=7, z=7.

BLOCKS:
- grass, dirt, stone, log, wood, leaves, glass
- water, snow, ice, brick, gold, diamond

CRITICAL RULES:
1. COMPLETE structures - no missing walls, roofs, or floors
2. Every wall needs ALL blocks from bottom to top
3. Roofs must cover the entire building
4. Each block needs unique id (e.g., "floor-1", "wall-north-1", "roof-1")

HOUSE TEMPLATE (follow this pattern):
1. FLOOR: Complete rectangle of wood blocks at y=0
2. WALLS: 4 complete walls, 3-4 blocks high
   - Front wall with door gap (leave 1x2 empty)
   - Back wall solid
   - Left and right walls solid
   - Windows: replace some wall blocks with glass
3. ROOF: Complete cover on top, 1 block overhang

Example 5x5 house:
- Floor: 25 wood blocks at y=0 (x=5-9, z=5-9)
- Walls: 4 walls, 3 high = ~40 blocks (minus door/windows)
- Roof: 25+ blocks at y=4
- Total: ~80-100 blocks

TREE TEMPLATE:
1. TRUNK: log blocks stacked vertically (4-6 high)
2. CROWN: leaves in a sphere/blob shape around top of trunk
   - Layer below top: 3x3 leaves with trunk in center
   - Top layer: 3x3 leaves
   - Very top: 1 leaf

WELL TEMPLATE:
1. BASE: Square ring of stone (hollow center)
2. WALLS: 2-3 blocks high stone ring
3. WATER: Fill center with water blocks
4. ROOF: Optional wood posts with wood plank roof

BE THOROUGH - generate every single block needed. Don't skip blocks assuming they exist.`,
    prompt: prompt,
    providerOptions: {
      openai: {
        strictJsonSchema: false,
      },
    },
  });

  return result.toTextStreamResponse();
}
