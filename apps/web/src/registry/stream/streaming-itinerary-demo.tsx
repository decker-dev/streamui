"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { MapPin } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { StreamingItinerary } from "./streaming-itinerary";
import { streamingItinerarySchema } from "./streaming-itinerary-schema";

const presets = [
  {
    label: "I want to visit all the FAANG campuses in one day",
    prompt:
      "Plan a day trip to visit the main FAANG headquarters in the San Francisco Bay Area. Include 4-5 stops with Google, Apple, Meta, and other major tech campuses I can see or take photos at.",
  },
  {
    label: "Planning a figure hunting day in Den Den Town",
    prompt:
      "Plan a day trip to Osaka's Den Den Town to hunt for rare anime figures. Include 3-4 stops with the best figure shops, Mandarake locations, and stores for limited collectibles.",
  },
  {
    label: "I want to visit where Korean esports pros train",
    prompt:
      "Plan a day in Seoul visiting spots where pro gamers train and compete. Include 3-4 stops with famous PC bangs, esports facilities, and gaming cafes in Gangnam.",
  },
  {
    label: "A day hitting retro arcades in Akihabara",
    prompt:
      "Plan a day visiting the best retro gaming arcades in Akihabara. Include 3-4 stops with arcades that have classic cabinets, rhythm games, and fighting game setups.",
  },
];

export function StreamingItineraryDemo() {
  const [selectedPreset, setSelectedPreset] = React.useState<
    (typeof presets)[number] | null
  >(null);

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

      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant={
              selectedPreset?.label === preset.label ? "default" : "outline"
            }
            size="sm"
            onClick={() => handlePreset(preset)}
            disabled={isLoading}
            className="justify-start gap-1.5"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{preset.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
