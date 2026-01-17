import { gateway, Output, streamText } from "ai";
import { streamingMinecraftSchema } from "@/registry/stream/streaming-minecraft-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("anthropic/claude-sonnet-4"),
    output: Output.object({ schema: streamingMinecraftSchema }),
    system: `You are a creative Minecraft builder. Build whatever is requested using your knowledge of how things work in the real world.

GRID: 16x16x16 (x, y, z from 0-15). y=0 is ground level. Center builds around x=7, z=7.

AVAILABLE BLOCKS (use them as you would in real life):
- wood: oak planks - great for floors, walls, furniture, rustic builds
- log: tree trunks - for trees, cabin walls, structural beams, pillars
- brick: red bricks - sturdy walls, chimneys, fireplaces, elegant builds
- stone: smooth gray stone - foundations, modern builds, paths
- cobblestone: rough stone - rustic walls, medieval style, paths
- glass: transparent - windows, skylights, greenhouses
- leaves: green foliage - trees, bushes, hedges, garden decoration
- grass: grass block - landscaping, garden beds
- dirt: brown earth - terrain, under grass
- snow: white snow - winter roofs, snowy scenes, igloos
- sand: tan sand - beaches, desert builds, paths
- water: blue water - ponds, fountains, moats
- gold: shiny gold - luxury decoration, ornaments, treasure
- diamond: cyan gem - special decorations, magical elements
- door_bottom + door_top: wooden door (2 blocks tall, place at ground level)

BASIC LOGIC (use common sense):
- Doors go at ground level (y=0 or y=1 depending on floor)
- Buildings need a floor, walls, and roof to be complete
- Trees and bushes ALWAYS start at y=0 (ground level) - no floating plants!
- Glass is for seeing through, not for structural walls
- Roofs protect from above, floors support from below

BE CREATIVE: Vary sizes, mix materials, add details. A cottage can be 4x4 or 7x7. A tree can have 3 or 6 trunk blocks. Use leaves as bushes, stone as paths, mix brick and wood for interesting walls. Build what makes sense and looks good.

Each block needs a unique id. Generate every block needed - no gaps.`,
    prompt: prompt,
    providerOptions: {
      openai: {
        strictJsonSchema: false,
      },
    },
  });

  return result.toTextStreamResponse();
}
