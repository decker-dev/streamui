"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { MapPin } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { StreamingItinerary } from "./streaming-itinerary";
import { streamingItinerarySchema } from "./streaming-itinerary-schema";

const presets = [
  {
    label: "Tokyo Food",
    prompt:
      "Plan a food lover's day trip in Tokyo, Japan. Include 5-6 stops with famous restaurants, street food spots, and local markets.",
  },
  {
    label: "Paris Art",
    prompt:
      "Plan a cultural day in Paris, France. Include 5-6 stops with museums, galleries, and artistic landmarks.",
  },
  {
    label: "NYC Walk",
    prompt:
      "Plan a walking tour of Manhattan, New York. Include 5-6 iconic landmarks and attractions.",
  },
  {
    label: "Barcelona",
    prompt:
      "Plan a day exploring Barcelona, Spain. Include 5-6 stops with Gaudí architecture, beaches, and tapas spots.",
  },
];

export function StreamingItineraryDemo() {
  const [selectedPreset, setSelectedPreset] = React.useState(presets[0]);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/stream/itinerary",
    schema: streamingItinerarySchema,
  });

  const handlePreset = (preset: (typeof presets)[number]) => {
    setSelectedPreset(preset);
    submit({ prompt: preset.prompt });
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <StreamingItinerary
        data={object ?? undefined}
        isLoading={isLoading}
        error={error ?? undefined}
      />

      {error && (
        <p className="text-center text-sm text-destructive">
          Error: {error.message}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant={
              selectedPreset.label === preset.label ? "default" : "outline"
            }
            size="sm"
            onClick={() => handlePreset(preset)}
            disabled={isLoading}
            className="gap-1.5"
          >
            <MapPin className="h-3.5 w-3.5" />
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
