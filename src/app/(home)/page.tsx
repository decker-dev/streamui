import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import Link from "next/link";
import { WeatherCard } from "@/registry/stream";
import {
  AnimatedFadeUp,
  AnimatedHero,
  AnimatedSection,
  AnimatedSectionScale,
  AnimatedStaggerSection,
  AnimatedStats,
} from "./animated";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center">
        {/* Gradient orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-linear-to-b from-primary/8 via-primary/4 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-linear-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-[5%] right-[15%] w-[300px] h-[300px] bg-linear-to-bl from-emerald-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <AnimatedHero className="flex flex-col items-center">
          {/* Title */}
          <AnimatedFadeUp>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Stream AI data
              <br />
              <span className="text-primary">beautifully</span>
            </h1>
          </AnimatedFadeUp>

          {/* Description */}
          <AnimatedFadeUp>
            <p className="max-w-xl mt-8 text-lg text-muted-foreground leading-relaxed">
              Progressive UI components for AI applications. Render structured
              data as it streams from your models. Built with AI SDK 6.
            </p>
          </AnimatedFadeUp>

          {/* CTA Buttons */}
          <AnimatedFadeUp className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link
              href="/docs"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:gap-3"
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://github.com/decker-dev/streamui"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full border bg-background/80 backdrop-blur-sm hover:bg-accent transition-colors"
            >
              <Star className="w-4 h-4" />
              Star on GitHub
            </a>
          </AnimatedFadeUp>
        </AnimatedHero>
      </section>

      {/* Hero Component - THE star of the show */}
      <section className="px-4 pb-32">
        <AnimatedSectionScale className="max-w-sm mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-linear-to-r from-cyan-500/20 via-primary/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-60" />

            {/* Card */}
            <div className="relative">
              <WeatherCard
                variant="elevated"
                data={{
                  location: "San Francisco",
                  temperature: 18,
                  condition: "cloudy",
                  humidity: 72,
                  windSpeed: 15,
                  forecast: [
                    { day: "Mon", high: 20, low: 14, condition: "sunny" },
                    { day: "Tue", high: 19, low: 13, condition: "cloudy" },
                    { day: "Wed", high: 17, low: 12, condition: "rainy" },
                  ],
                }}
              />
            </div>
          </div>
        </AnimatedSectionScale>
      </section>

      {/* Social proof / stats */}
      <section className="px-4 pb-32">
        <div className="max-w-4xl mx-auto">
          <AnimatedStats
            stats={[
              { value: "AI SDK 6", label: "Compatible" },
              { value: "100%", label: "TypeScript" },
              { value: "Zod", label: "Schemas" },
              { value: "MIT", label: "Licensed" },
            ]}
          />
        </div>
      </section>

      {/* Progressive Rendering Section */}
      <section className="px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          <AnimatedStaggerSection className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedFadeUp className="space-y-6">
              <div className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                <Zap className="w-4 h-4" />
                Progressive Rendering
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                Data appears
                <br />
                as it streams
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Components render progressively as structured data streams from
                your AI model. No loading spinners, no waiting—just smooth,
                real-time updates.
              </p>
              <Link
                href="/docs/stream/weather-card"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                View documentation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedFadeUp>

            <AnimatedFadeUp className="space-y-4">
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Partial data renders immediately
                </div>
                <WeatherCard
                  data={{
                    location: "Tokyo",
                    temperature: 22,
                    condition: "sunny",
                  }}
                />
              </div>
            </AnimatedFadeUp>
          </AnimatedStaggerSection>
        </div>
      </section>

      {/* Schema-First Section */}
      <section className="px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          <AnimatedStaggerSection className="text-center mb-16">
            <AnimatedFadeUp className="inline-flex items-center gap-2 text-sm text-primary font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Schema-First Design
            </AnimatedFadeUp>
            <AnimatedFadeUp>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Type-safe from model to UI
              </h2>
            </AnimatedFadeUp>
            <AnimatedFadeUp>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Define your schema once with Zod. Use it with AI SDK's{" "}
                <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                  Output.object()
                </code>{" "}
                for structured streaming. The component handles the rest.
              </p>
            </AnimatedFadeUp>
          </AnimatedStaggerSection>

          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="rounded-xl border bg-card p-6 space-y-3">
                <div className="text-sm font-medium">1. Define schema</div>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`const schema = z.object({
  location: z.string(),
  temperature: z.number(),
  condition: z.enum([
    "sunny", "cloudy", "rainy"
  ]),
});`}</code>
                </pre>
              </div>
              <div className="rounded-xl border bg-card p-6 space-y-3">
                <div className="text-sm font-medium">2. Stream & render</div>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`const { object } = useObject({
  api: "/api/weather",
  schema: weatherCardSchema,
});

<WeatherCard data={object} />`}</code>
                </pre>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Live Demo CTA */}
      <section className="px-4 pb-32">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="relative rounded-2xl border bg-card p-8 md:p-12 text-center overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-cyan-500/5" />

              <div className="relative space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">
                  See it in action
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Try the live demo to see how components stream data in
                  real-time from an AI model.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/demo/stream"
                    className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:gap-3"
                  >
                    Try Live Demo
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full border bg-background/80 hover:bg-accent transition-colors"
                  >
                    Read the Docs
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          Built by{" "}
          <a
            href="https://x.com/0xDecker"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            0xDecker
          </a>
          . Open source on{" "}
          <a
            href="https://github.com/decker-dev/streamui"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </div>
      </footer>
    </div>
  );
}
