import { gateway, Output, streamText } from "ai";
import { weatherCardSchema } from "@/registry/stream/weather-card-schema";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: gateway("openai/gpt-4.1-mini"),
    output: Output.object({ schema: weatherCardSchema }),
    system: `You are a weather data generator. Generate realistic weather data for the requested location.
Always include:
- location: the city name
- temperature: realistic temperature in Celsius for that location
- condition: one of sunny, cloudy, rainy, snowy, windy
- humidity: percentage (0-100)
- windSpeed: in km/h
- forecast: 3-day forecast with day names (Mon, Tue, Wed, etc.), high/low temps, and conditions

Make the data realistic based on typical weather patterns for the location and current season.`,
    prompt: `Generate weather data for: ${prompt}`,
    providerOptions: {
      openai: {
        strictJsonSchema: false,
      },
    },
  });

  return result.toTextStreamResponse();
}
