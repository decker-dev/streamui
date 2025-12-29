"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Send } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeatherCard, weatherCardSchema } from "./weather-card";

export function WeatherCardDemo() {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // 🔍 Logger: captura todos los estados de object
  const historyRef = React.useRef<unknown[]>([]);
  const prevIsLoadingRef = React.useRef(false);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/stream/weather",
    schema: weatherCardSchema,
  });

  // 🔍 Captura cada cambio y loguea al final
  React.useEffect(() => {
    // Guardar cada estado
    historyRef.current.push(object ? JSON.parse(JSON.stringify(object)) : null);
    
    // Si terminó el stream (isLoading pasó de true a false)
    if (prevIsLoadingRef.current && !isLoading) {
      console.log("📊 Historial completo del stream:", historyRef.current);
      console.log("📄 JSON final:", JSON.stringify(historyRef.current));
      // Guardar en window para fácil acceso
      (window as any).__STREAM_HISTORY__ = historyRef.current;
      historyRef.current = []; // Reset para próximo stream
    }
    
    prevIsLoadingRef.current = isLoading;
  }, [object, isLoading]);

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
    <div className="flex flex-col gap-6">
      <div className="w-full max-w-sm mx-auto">
        <WeatherCard
          data={object ?? undefined}
          isLoading={isLoading && !object}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">
          Error: {error.message}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex gap-2 max-w-sm mx-auto w-full">
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
