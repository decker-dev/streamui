"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Send } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeatherCard } from "./weather-card";
import { weatherCardSchema } from "./weather-card-schema";

export function WeatherCardDemo() {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/stream/weather",
    schema: weatherCardSchema,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    submit({ prompt: inputValue });
  };

  const handleQuickCity = (city: string) => {
    setInputValue(city);
    submit({ prompt: city });
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <WeatherCard
        data={object ?? undefined}
        isLoading={isLoading}
        error={error ?? undefined}
      />

      {error && (
        <p className="text-center text-sm text-destructive">
          Error: {error.message}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a city name…"
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !inputValue.trim()}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Get weather</span>
        </Button>
      </form>

      <div className="flex flex-wrap justify-center gap-2">
        {["Tokyo", "New York", "London", "Sydney", "Buenos Aires"].map(
          (city) => (
            <Button
              key={city}
              variant="outline"
              size="sm"
              onClick={() => handleQuickCity(city)}
              disabled={isLoading}
            >
              {city}
            </Button>
          ),
        )}
      </div>
    </div>
  );
}

