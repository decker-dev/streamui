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

function ContextInspector() {
  return (
    <Card>
      <CardContent className="p-3 font-mono text-xs">
        <div className="mb-2 font-sans text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Context State
        </div>
        <div className="space-y-1.5">
          <Stream.When loading>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">state:</span>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                loading
              </Badge>
            </div>
          </Stream.When>
          <Stream.When streaming>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">state:</span>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-600 dark:text-blue-400">
                streaming
              </Badge>
            </div>
          </Stream.When>
          <Stream.When complete>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">state:</span>
              <Badge variant="outline" className="bg-green-500/20 text-green-600 dark:text-green-400">
                complete
              </Badge>
            </div>
          </Stream.When>
          <Stream.Field<string>
            path="location"
            fallback={
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">location:</span>
                <span className="text-muted-foreground/50">undefined</span>
              </div>
            }
          >
            {(location) => (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">location:</span>
                <span className="text-foreground">"{location}"</span>
              </div>
            )}
          </Stream.Field>
          <Stream.Field<number>
            path="temperature"
            fallback={
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">temperature:</span>
                <span className="text-muted-foreground/50">undefined</span>
              </div>
            }
          >
            {(temp) => (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">temperature:</span>
                <span className="text-foreground">{temp}</span>
              </div>
            )}
          </Stream.Field>
          <Stream.Field<string>
            path="condition"
            fallback={
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">condition:</span>
                <span className="text-muted-foreground/50">undefined</span>
              </div>
            }
          >
            {(condition) => (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">condition:</span>
                <span className="text-foreground">"{condition}"</span>
              </div>
            )}
          </Stream.Field>
        </div>
      </CardContent>
    </Card>
  );
}

export function StreamRootDemo() {
  const { data, isLoading, step, totalSteps, isIdle, isComplete, start, reset } =
    useStreamSimulator({ sequence: STREAM_SEQUENCE, delay: 800 });

  const isStreaming = isLoading && data !== undefined;

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
            <CardContent className="p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Rendered UI
              </div>
              <div className="space-y-1 pt-1">
                <div className="h-7 flex items-center">
                  <Stream.Field<string>
                    path="location"
                    fallback={<Skeleton className="h-5 w-16" />}
                  >
                    {(location) => (
                      <h3 className="text-lg font-semibold leading-7">{location}</h3>
                    )}
                  </Stream.Field>
                </div>

                <div className="h-10 flex items-center">
                  <Stream.Field<number>
                    path="temperature"
                    fallback={<Skeleton className="h-8 w-12" />}
                  >
                    {(temp) => (
                      <span className="text-3xl font-bold tabular-nums leading-none">
                        {temp}°
                      </span>
                    )}
                  </Stream.Field>
                </div>

                <div className="h-5 flex items-center">
                  <Stream.Field<string>
                    path="condition"
                    fallback={<Skeleton className="h-4 w-12" />}
                  >
                    {(condition) => (
                      <p className="text-sm text-muted-foreground leading-5">{condition}</p>
                    )}
                  </Stream.Field>
                </div>
              </div>
            </CardContent>
          </Card>

          <ContextInspector />
        </div>
      </Stream.Root>
    </div>
  );
}
