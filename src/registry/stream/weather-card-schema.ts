import { z } from "zod";

export const weatherConditions = [
  "sunny",
  "cloudy",
  "rainy",
  "snowy",
  "windy",
] as const;

export type WeatherCondition = (typeof weatherConditions)[number];

export const weatherCardSchema = z.object({
  location: z.string().describe("City name"),
  temperature: z.number().describe("Temperature in Celsius"),
  condition: z.enum(weatherConditions).describe("Weather condition"),
  humidity: z.number().nullable().describe("Humidity percentage"),
  windSpeed: z.number().nullable().describe("Wind speed in km/h"),
  forecast: z
    .array(
      z.object({
        day: z.string().describe("Day name (e.g., Mon, Tue)"),
        high: z.number().describe("High temperature"),
        low: z.number().describe("Low temperature"),
        condition: z.enum(weatherConditions),
      }),
    )
    .nullable()
    .describe("3-day forecast"),
});

export type WeatherCardData = z.infer<typeof weatherCardSchema>;
