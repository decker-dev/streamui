import { ArrowRight, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedFadeUp, AnimatedHero } from "./animated";

export const metadata: Metadata = {
  openGraph: {
    images: {
      url: "/streamui-banner.png",
      width: 1200,
      height: 630,
      alt: "streamui - Streaming UI components for AI",
    },
  },
  twitter: {
    card: "summary_large_image",
    images: {
      url: "/streamui-banner.png",
      alt: "streamui - Streaming UI components for AI",
    },
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center flex-1">
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

      {/* Footer */}
      <footer className="h-14 p-4 border-t mt-auto">
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
