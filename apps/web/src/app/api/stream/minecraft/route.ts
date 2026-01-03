import { gateway, Output, streamText } from "ai";
import { streamingMinecraftSchema } from "@/registry/stream/streaming-minecraft-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("openai/gpt-4.1-mini"),
    output: Output.object({ schema: streamingMinecraftSchema }),
    system: `You are a Minecraft builder. Create complete, recognizable structures block by block.

GRID: 16x16x16 (x, y, z from 0-15). y=0 is ground. Center builds around x=7, z=7.

BLOCKS (all have textures):
- grass: green grass block (top green, sides dirt with grass)
- dirt: brown dirt
- stone: gray smooth stone
- cobblestone: gray rough cobblestone
- log: oak tree trunk (bark on sides, rings on top)
- wood: oak planks (for floors, walls, roofs)
- leaves: green oak leaves
- glass: transparent glass (for windows)
- brick: red bricks
- gold: shiny gold block (decorations, ornaments)
- diamond: cyan diamond block (decorations, ornaments)
- snow: white snow
- sand: tan sand
- water: blue water

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

CHRISTMAS TREE:
1. TRUNK: 3 log blocks
2. LEAVES: Pyramid shape - 5x5 bottom, 3x3 middle, 1x1 top
3. DECORATIONS: gold and diamond blocks scattered on leaves
4. STAR: gold block on very top

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
