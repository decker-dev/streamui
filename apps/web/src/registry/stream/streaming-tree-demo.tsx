"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { FolderTree } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { StreamingTree } from "./streaming-tree";
import { streamingTreeSchema } from "./streaming-tree-schema";

const presets = [
  {
    label: "Next.js",
    prompt:
      "File structure for a Next.js 16 app with app router, including common folders like components, lib, and api routes",
  },
  {
    label: "React Native",
    prompt:
      "File structure for a React Native app with Expo, including screens, components, navigation, and assets",
  },
  {
    label: "API Project",
    prompt:
      "File structure for a Node.js REST API with Express, including routes, controllers, models, and middleware",
  },
  {
    label: "Monorepo",
    prompt:
      "File structure for a monorepo with packages for shared UI components, a web app, and a mobile app",
  },
];

export function StreamingTreeDemo() {
  const [selectedPreset, setSelectedPreset] = React.useState(presets[0]);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/stream/tree",
    schema: streamingTreeSchema,
  });

  const handlePreset = (preset: (typeof presets)[number]) => {
    setSelectedPreset(preset);
    submit({ prompt: preset.prompt });
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <StreamingTree
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
            <FolderTree className="h-3.5 w-3.5" />
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
