"use client";

import { Stream } from "@stream.ui/react";
import { Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStreamSimulator } from "@/hooks/use-stream-simulator";

interface DemoData {
  location?: string;
  temperature?: number;
  condition?: string;
}

const STREAM_SEQUENCE: DemoData[] = [
  {},
  { location: "Tokyo" },
  { location: "Tokyo", temperature: 22 },
  { location: "Tokyo", temperature: 22, condition: "Sunny" },
];

function ContextInspector({
  data,
  state,
}: {
  data: DemoData | undefined;
  state: "idle" | "loading" | "streaming" | "complete";
}) {
  const stateColors = {
    idle: "bg-muted text-muted-foreground",
    loading: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    streaming: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
    complete: "bg-green-500/20 text-green-600 dark:text-green-400",
  };

  return (
    <Card className="py-0">
      <CardContent className="p-3 font-mono text-xs">
        <div className="mb-2 font-sans text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Context State
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">location:</span>
            <Stream.Field fallback={<span className="text-muted-foreground/50">undefined</span>}>
              {data?.location}
            </Stream.Field>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">temperature:</span>
            <Stream.Field fallback={<span className="text-muted-foreground/50">undefined</span>}>
              {data?.temperature}
            </Stream.Field>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">condition:</span>
            <Stream.Field fallback={<span className="text-muted-foreground/50">undefined</span>}>
              {data?.condition}
            </Stream.Field>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-muted-foreground">state:</span>
            <Badge variant="outline" className={stateColors[state]}>{state}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StreamRootDemo() {
  const { data, isLoading, step, totalSteps, isIdle, isComplete, start, reset } =
    useStreamSimulator({ sequence: STREAM_SEQUENCE, delay: 800 });

  const isStreaming = isLoading && data !== undefined;
  const currentState = isComplete ? "complete" : isStreaming ? "streaming" : isLoading ? "loading" : "idle";

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

      <Stream.Root data={data} isLoading={isLoading}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className={`py-0 transition-colors ${borderColors[currentState]}`}>
            <CardContent className="p-3 font-mono text-xs">
              <div className="mb-2 font-sans text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Rendered UI
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">location:</span>
                  <Stream.Field fallback={<Skeleton className="h-3 w-10" />}>
                    {data?.location}
                  </Stream.Field>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">temperature:</span>
                  <Stream.Field fallback={<Skeleton className="h-3 w-6" />}>
                    <span>{data?.temperature}°</span>
                  </Stream.Field>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">condition:</span>
                  <Stream.Field fallback={<Skeleton className="h-3 w-10" />}>
                    {data?.condition}
                  </Stream.Field>
                </div>
              </div>
            </CardContent>
          </Card>

          <ContextInspector data={data} state={currentState} />
        </div>
      </Stream.Root>
    </div>
  );
}
