"use client";

import { Stream } from "@stream.ui/react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Play,
  Radio,
  RotateCcw,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DemoState = "idle" | "loading" | "streaming" | "complete" | "error";

interface PartialData {
  message?: string;
}

export function StreamWhenDemo() {
  const [data, setData] = React.useState<PartialData | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>();
  const [currentState, setCurrentState] = React.useState<DemoState>("idle");
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const runSequence = (simulateError: boolean = false) => {
    cleanup();
    setData(undefined);
    setError(undefined);
    setIsLoading(true);
    setCurrentState("loading");

    timeoutRef.current = setTimeout(() => {
      setData({ message: "Streaming…" });
      setCurrentState("streaming");

      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        if (simulateError) {
          setError(new Error("Connection failed"));
          setCurrentState("error");
        } else {
          setData({ message: "Done!" });
          setCurrentState("complete");
        }
      }, 1500);
    }, 1000);
  };

  const reset = () => {
    cleanup();
    setData(undefined);
    setError(undefined);
    setIsLoading(false);
    setCurrentState("idle");
  };

  React.useEffect(() => cleanup, []);

  const borderColors: Record<DemoState, string> = {
    idle: "",
    loading: "border-yellow-500/50",
    streaming: "border-blue-500/50",
    complete: "border-green-500/50",
    error: "border-destructive/50",
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => runSequence(false)} disabled={isLoading}>
            <Play className="h-3.5 w-3.5" />
            Success
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => runSequence(true)}
            disabled={isLoading}
          >
            <Play className="h-3.5 w-3.5" />
            Error
          </Button>
          {currentState !== "idle" && (
            <Button size="icon" variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <span className="text-xs text-muted-foreground capitalize">
          {currentState}
        </span>
      </div>

      <Card className={`py-0 transition-colors ${borderColors[currentState]}`}>
        <CardContent className="p-4">
          <Stream.Root data={data} isLoading={isLoading} error={error}>
            <div className="flex min-h-[140px] flex-col items-center justify-center gap-3">
              {currentState === "idle" && (
                <p className="text-sm text-muted-foreground">
                  Click a button to start
                </p>
              )}

              <Stream.When loading>
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Loading…</p>
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                    {"<Stream.When loading>"}
                  </code>
                </div>
              </Stream.When>

              <Stream.When streaming>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Radio className="h-8 w-8 text-blue-500" />
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Streaming data…
                  </p>
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                    {"<Stream.When streaming>"}
                  </code>
                </div>
              </Stream.When>

              <Stream.When complete>
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Complete!
                  </p>
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                    {"<Stream.When complete>"}
                  </code>
                </div>
              </Stream.When>

              <Stream.When error>
                {(err) => (
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <p className="text-sm text-destructive">{err.message}</p>
                    <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                      {"<Stream.When error>"}
                    </code>
                  </div>
                )}
              </Stream.When>
            </div>
          </Stream.Root>
        </CardContent>
      </Card>
    </div>
  );
}
