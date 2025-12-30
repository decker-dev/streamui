"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { BarChart3 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { StreamingChart } from "./streaming-chart";
import { streamingChartSchema } from "./streaming-chart-schema";

const presets = [
  { label: "Revenue", prompt: "Monthly revenue for a SaaS company in 2024" },
  { label: "Users", prompt: "Monthly active users growth for a social app" },
  { label: "Sales", prompt: "Quarterly sales data for an e-commerce store" },
  { label: "Traffic", prompt: "Website traffic by month for a tech blog" },
];

export function StreamingChartDemo() {
  const [selectedPreset, setSelectedPreset] = React.useState(presets[0]);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/stream/chart",
    schema: streamingChartSchema,
  });

  const handlePreset = (preset: (typeof presets)[number]) => {
    setSelectedPreset(preset);
    submit({ prompt: preset.prompt });
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <StreamingChart
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
            <BarChart3 className="h-3.5 w-3.5" />
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
