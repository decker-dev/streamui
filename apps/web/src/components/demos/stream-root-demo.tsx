"use client";

import { Stream } from "@stream.ui/react";
import { Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStreamSimulator } from "@/hooks/use-stream-simulator";
import { cn } from "@/lib/cn";

interface WeatherData {
  location?: string;
  temperature?: number;
  condition?: string;
}

const STREAM_SEQUENCE: WeatherData[] = [
  {},
  { location: "Tokyo" },
  { location: "Tokyo", temperature: 22 },
  { location: "Tokyo", temperature: 22, condition: "Sunny" },
];

function ContextInspector({
  state,
}: {
  state: "idle" | "loading" | "streaming" | "complete";
}) {
  const stateConfig = {
    idle: { label: "idle", className: "bg-muted text-muted-foreground" },
    loading: { label: "loading", className: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" },
    streaming: { label: "streaming", className: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
    complete: { label: "complete", className: "bg-green-500/20 text-green-600 dark:text-green-400" },
  };

  const { label, className } = stateConfig[state];

  return (
    <Card className="py-0">
      <CardContent className="p-3 font-mono text-xs">
        <div className="text-[10px] font-sans font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Context State
        </div>
        <div className="space-y-2">
          <Row label="state">
            <Badge variant="outline" className={className}>
              {label}
            </Badge>
          </Row>
          <Stream.Field<string>
            path="location"
            fallback={<Row label="location"><span className="text-muted-foreground/50">undefined</span></Row>}
          >
            {(location) => <Row label="location">"{location}"</Row>}
          </Stream.Field>
          <Stream.Field<number>
            path="temperature"
            fallback={<Row label="temperature"><span className="text-muted-foreground/50">undefined</span></Row>}
          >
            {(temp) => <Row label="temperature">{temp}</Row>}
          </Stream.Field>
          <Stream.Field<string>
            path="condition"
            fallback={<Row label="condition"><span className="text-muted-foreground/50">undefined</span></Row>}
          >
            {(condition) => <Row label="condition">"{condition}"</Row>}
          </Stream.Field>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 h-5">
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}

export function StreamRootDemo() {
  const { data, isLoading, step, totalSteps, isIdle, isComplete, start, reset } =
    useStreamSimulator({ sequence: STREAM_SEQUENCE, delay: 800 });

  const isStreaming = isLoading && data !== undefined;

  const currentState = isComplete
    ? "complete"
    : isStreaming
      ? "streaming"
      : isLoading
        ? "loading"
        : "idle";

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
          <Card
            className={cn(
              "transition-colors duration-300 py-0",
              isStreaming && "border-blue-500",
              isComplete && "border-green-500"
            )}
          >
            <CardContent className="p-3 font-mono text-xs">
              <div className="text-[10px] font-sans font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Rendered UI
              </div>
              <div className="space-y-2">
                <div className="h-5 flex items-center">
                  <Stream.Field<string>
                    path="location"
                    fallback={<Skeleton className="h-3 w-12" />}
                  >
                    {(location) => (
                      <span className="font-semibold">{location}</span>
                    )}
                  </Stream.Field>
                </div>

                <div className="h-5 flex items-center">
                  <Stream.Field<number>
                    path="temperature"
                    fallback={<Skeleton className="h-3 w-8" />}
                  >
                    {(temp) => (
                      <span className="font-bold tabular-nums">{temp}°</span>
                    )}
                  </Stream.Field>
                </div>

                <div className="h-5 flex items-center">
                  <Stream.Field<string>
                    path="condition"
                    fallback={<Skeleton className="h-3 w-10" />}
                  >
                    {(condition) => (
                      <span className="text-muted-foreground">{condition}</span>
                    )}
                  </Stream.Field>
                </div>
              </div>
            </CardContent>
          </Card>

          <ContextInspector state={currentState} />
        </div>
      </Stream.Root>
    </div>
  );
}
