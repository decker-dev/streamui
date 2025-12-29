"use client";

import { Stream } from "@stream.ui/react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStreamSimulator } from "@/hooks/use-stream-simulator";

interface PartialData {
  title?: string;
  description?: string;
  value?: number;
}

const STREAM_SEQUENCE: PartialData[] = [
  {},
  { title: "" },
  { title: "H" },
  { title: "He" },
  { title: "Hel" },
  { title: "Hell" },
  { title: "Hello" },
  { title: "Hello " },
  { title: "Hello W" },
  { title: "Hello Wo" },
  { title: "Hello Wor" },
  { title: "Hello Worl" },
  { title: "Hello World" },
  { title: "Hello World", description: "" },
  { title: "Hello World", description: "This" },
  { title: "Hello World", description: "This is" },
  { title: "Hello World", description: "This is streaming" },
  { title: "Hello World", description: "This is streaming data" },
  { title: "Hello World", description: "This is streaming data", value: 42 },
];

export function StreamFieldDemo() {
  const {
    data,
    isLoading,
    step,
    totalSteps,
    isIdle,
    isComplete,
    start,
    reset,
  } = useStreamSimulator({ sequence: STREAM_SEQUENCE, delay: 80 });

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={start} disabled={isLoading}>
            <Play className="h-3.5 w-3.5" />
            {isIdle ? "Start" : "Restart"}
          </Button>
          {!isIdle && (
            <Button size="icon" variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          Step {step + 1}/{totalSteps}
        </span>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Stream.Root data={data} isLoading={isLoading}>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">
                  path="title"
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  <Stream.Field path="title" fallback={<Skeleton className="h-8 w-40" />} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">
                  path="description"
                </div>
                <div className="text-muted-foreground">
                  <Stream.Field path="description" fallback={<Skeleton className="h-5 w-56" />} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">
                  path="value"
                </div>
                <div className="text-4xl font-bold tabular-nums">
                  <Stream.Field path="value" fallback={<Skeleton className="h-10 w-16" />} />
                </div>
              </div>
            </div>
          </Stream.Root>
        </CardContent>
      </Card>

      {isComplete && (
        <p className="text-center text-sm text-green-600 dark:text-green-400">
          ✓ Stream complete
        </p>
      )}
    </div>
  );
}
