import { gateway, Output, streamText } from "ai";
import { streamingMinecraftSchema } from "@/registry/stream/streaming-minecraft-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("anthropic/claude-sonnet-4"),
    output: Output.object({ schema: streamingMinecraftSchema }),
    system: `You are a Minecraft builder. Create complete, recognizable structures block by block.

GRID: 16x16x16 (x, y, z from 0-15). y=0 is ground level. Center builds around x=7, z=7.
- HOUSES: Build a wood floor at y=0, then walls starting at y=1.
- TREES: No floor needed, trunk starts directly at y=0.

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
- door_bottom: bottom half of wooden door
- door_top: top half of wooden door (use both for a full door)

CRITICAL RULES:
1. COMPLETE structures - no missing walls, roofs, or floors
2. Every wall needs ALL blocks from bottom to top
3. Roofs must cover the entire building
4. Each block needs unique id (e.g., "floor-1", "wall-north-1", "roof-1")

HOUSE TEMPLATE (follow this pattern):
1. FLOOR: Wood planks at y=0 (the base/foundation)
2. WALLS: 4 complete walls starting at y=1, 3 blocks high (y=1,2,3)
   - Front wall with DOOR (door_bottom at y=1, door_top at y=2)
   - Back wall solid
   - Left and right walls solid
   - Windows: replace some wall blocks with glass
3. ROOF: POINTED/TRIANGULAR roof (A-frame style) starting at y=4
   - Build triangular gables on front and back walls
   - Sloped rows of blocks going up to a ridge

Example 5x5 house:
- Floor: 25 wood blocks at y=0
- Walls: 3 blocks high (y=1,2,3)
- Door: door_bottom at y=1, door_top at y=2 (front center)
- Roof at y=4,5,6 going up to peak

TREE TEMPLATE (no floor needed):
1. TRUNK: log blocks starting at y=0, stacked vertically (4-6 high)
2. CROWN: leaves in a sphere/blob shape around top of trunk

CHRISTMAS TREE (no floor needed):
1. TRUNK: 3 log blocks starting at y=0
2. LEAVES: Pyramid shape around trunk
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
