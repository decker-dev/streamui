"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { StreamingMinecraft } from "./streaming-minecraft";
import { streamingMinecraftSchema } from "./streaming-minecraft-schema";

const presets = [
  {
    label: "Small house",
    prompt: "Build a tiny wooden house: 4x4 floor, 3 blocks tall walls, flat roof, 2 glass windows.",
  },
  {
    label: "Oak tree",
    prompt: "Build a simple oak tree: 4 log blocks as trunk, leaves on top forming a small crown.",
  },
  {
    label: "Stone well",
    prompt: "Build a small stone well: square base with water in the center.",
  },
  {
    label: "Garden",
    prompt: "Build a tiny garden: grass base, one tree, and some flowers using leaves.",
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
