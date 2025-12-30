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

  const isStreaming = isLoading && data !== undefined;
  const currentState = isComplete
    ? "complete"
    : isStreaming
      ? "streaming"
      : isLoading
        ? "loading"
        : "idle";

  const borderColors = {
    idle: "",
    loading: "border-yellow-500/50",
    streaming: "border-blue-500/50",
    complete: "border-green-500/50",
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
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
          {step === -1 ? "Idle" : `Step ${step + 1}/${totalSteps}`}
        </span>
      </div>

      <Card className={`py-0 transition-colors ${borderColors[currentState]}`}>
        <CardContent className="p-4">
          <Stream.Root data={data} isLoading={isLoading}>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  title
                </div>
                <div className="min-h-8 text-2xl font-bold tracking-tight">
                  <Stream.Field fallback={<Skeleton className="h-8 w-40" />}>
                    {data?.title}
                  </Stream.Field>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  description
                </div>
                <div className="min-h-5 text-muted-foreground">
                  <Stream.Field fallback={<Skeleton className="h-5 w-56" />}>
                    {data?.description}
                  </Stream.Field>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  value
                </div>
                <div className="min-h-10 text-4xl font-bold tabular-nums">
                  <Stream.Field fallback={<Skeleton className="h-10 w-16" />}>
                    {data?.value}
                  </Stream.Field>
                </div>
              </div>
            </div>
          </Stream.Root>
        </CardContent>
      </Card>
    </div>
  );
}
