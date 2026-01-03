"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { StreamingMinecraft } from "./streaming-minecraft";
import { streamingMinecraftSchema } from "./streaming-minecraft-schema";

const presets = [
  {
    label: "Wooden house",
    prompt: "Build a complete small wooden house: wood plank floor (5x5), 4 solid walls 3 blocks high with 2 glass windows and a door gap, and a full wood roof on top. Make sure every wall is complete with no gaps except the door.",
  },
  {
    label: "Oak tree",
    prompt: "Build a complete oak tree: trunk of 5 log blocks stacked vertically, then a full sphere of leaves around the top (about 20-25 leaf blocks forming a complete crown).",
  },
  {
    label: "Christmas tree",
    prompt: "Build a Christmas tree: log trunk (3 blocks), then layers of leaves getting smaller as they go up (5x5 at bottom, then 3x3, then 1x1 at top). Decorate with gold and diamond blocks scattered on the leaves as ornaments. Add a gold block star on top.",
  },
  {
    label: "Cottage with garden",
    prompt: "Build a complete cottage scene: a small brick house with wood floor, glass windows, full roof, plus 2 small trees nearby and some grass blocks as a garden path.",
  },
];

function BlockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 1L15 5V11L8 15L1 11V5L8 1Z" fill="currentColor" opacity="0.8" />
      <path d="M8 1L15 5L8 9L1 5L8 1Z" fill="currentColor" />
      <path d="M8 9V15L1 11V5L8 9Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function StreamingMinecraftDemo() {
  const [selectedPreset, setSelectedPreset] = React.useState<
    (typeof presets)[number] | null
  >(null);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/stream/minecraft",
    schema: streamingMinecraftSchema,
  });

  const handlePreset = (preset: (typeof presets)[number]) => {
    setSelectedPreset(preset);
    submit({ prompt: preset.prompt });
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <StreamingMinecraft
        data={object ?? undefined}
        isLoading={isLoading}
        error={error ?? undefined}
      />

      {error && (
        <p
          className="text-center text-sm text-destructive font-mono"
          role="alert"
          aria-live="polite"
        >
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
            className="justify-start gap-1.5 font-mono text-xs"
          >
            {isLoading && selectedPreset?.label === preset.label ? (
              <Loader2
                className="h-3.5 w-3.5 shrink-0 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <BlockIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">{preset.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
