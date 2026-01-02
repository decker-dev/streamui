import { z } from "zod";

export const itineraryStopSchema = z.object({
  id: z.string().describe("Unique identifier for the stop"),
  name: z.string().describe("Name of the place or attraction"),
  description: z.string().describe("Brief description of what to do here"),
  duration: z.string().describe("Suggested time to spend (e.g., '2 hours', '30 min')"),
  longitude: z.number().describe("Longitude coordinate"),
  latitude: z.number().describe("Latitude coordinate"),
  type: z
    .enum(["food", "attraction", "hotel", "transport", "activity", "shopping"])
    .describe("Type of stop"),
});

export const streamingItinerarySchema = z.object({
  title: z.string().describe("Trip title (e.g., '3 Days in Tokyo')"),
  description: z.string().describe("Brief overview of the trip"),
  stops: z.array(itineraryStopSchema).describe("Ordered list of stops in the itinerary"),
});

export type ItineraryStop = z.infer<typeof itineraryStopSchema>;
export type StreamingItineraryData = z.infer<typeof streamingItinerarySchema>;

