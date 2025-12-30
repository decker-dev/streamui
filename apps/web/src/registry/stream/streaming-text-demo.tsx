"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { MessageSquare } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { StreamingText } from "./streaming-text";
import { streamingTextSchema } from "./streaming-text-schema";

const presets = [
  { label: "React", prompt: "What is React?" },
  { label: "TypeScript", prompt: "Explain TypeScript" },
  { label: "Streaming", prompt: "What is streaming?" },
  { label: "Next.js", prompt: "What is Next.js?" },
];

export function StreamingTextDemo() {
  const [selectedPreset, setSelectedPreset] = React.useState(presets[0]);

  const { object, isLoading, submit } = useObject({
    api: "/api/stream/text",
    schema: streamingTextSchema,
  });

  const handlePreset = (preset: (typeof presets)[number]) => {
    setSelectedPreset(preset);
    submit({ prompt: preset.prompt });
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="rounded-xl border bg-card p-4 min-h-[120px]">
        {!object?.text && !isLoading ? (
          <span className="text-muted-foreground">
            Click a button to see streaming text…
          </span>
        ) : (
          <StreamingText streaming={isLoading} smooth>
            {object?.text ?? ""}
          </StreamingText>
        )}
      </div>

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
            <MessageSquare className="h-3.5 w-3.5" />
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
