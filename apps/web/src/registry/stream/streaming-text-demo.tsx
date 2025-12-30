"use client";

import * as React from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StreamingText } from "./streaming-text";
import { streamingTextSchema } from "./streaming-text-schema";

const suggestions = [
  "What is React?",
  "Explain TypeScript",
  "What is streaming?",
];

export function StreamingTextDemo() {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { object, isLoading, submit } = useObject({
    api: "/api/stream/text",
    schema: streamingTextSchema,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    submit({ prompt: inputValue });
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    submit({ prompt: suggestion });
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="rounded-xl border bg-card p-4 min-h-[120px]">
        {!object?.text && !isLoading ? (
          <span className="text-muted-foreground">
            Ask something to see streaming text…
          </span>
        ) : (
          <StreamingText streaming={isLoading}>
            {object?.text ?? ""}
          </StreamingText>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask anything…"
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !inputValue.trim()}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>

      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => handleSuggestion(suggestion)}
            disabled={isLoading}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${isLoading ? "bg-blue-500 animate-pulse" : object?.text ? "bg-green-500" : "bg-muted"}`}
          />
          {isLoading ? "Streaming" : object?.text ? "Complete" : "Idle"}
        </span>
      </div>
    </div>
  );
}
