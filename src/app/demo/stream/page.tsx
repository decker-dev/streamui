import { WeatherCardDemo } from "@/registry/stream/weather-card-demo";

export default function StreamDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              StreamUI Demo
            </h1>
            <p className="text-muted-foreground">
              Weather card that streams progressively from AI
            </p>
          </div>

          <WeatherCardDemo />

          <div className="text-center text-xs text-muted-foreground">
            Powered by AI SDK 6 + Gemini via AI Gateway
          </div>
        </div>
      </div>
    </div>
  );
}

