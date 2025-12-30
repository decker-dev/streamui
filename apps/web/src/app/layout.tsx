import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://streamui.dev"),
  title: {
    default: "streamui - Streaming UI components for AI",
    template: "%s | streamui",
  },
  description:
    "Beautiful streaming UI components for AI applications. Build progressive, real-time interfaces with React and AI SDK. Streaming text, data visualizations, and more.",
  keywords: [
    "streaming UI",
    "React",
    "Next.js",
    "AI SDK",
    "AI components",
    "real-time UI",
    "progressive rendering",
    "Vercel AI SDK",
    "streaming components",
    "AI streaming",
    "structured output",
    "React components",
    "TypeScript",
    "Tailwind CSS",
    "shadcn",
    "shadcn/ui",
  ],
  authors: [{ name: "0xDecker", url: "https://x.com/0xDecker" }],
  creator: "0xDecker",
  publisher: "streamui",
  category: "Technology",
  alternates: {
    canonical: "https://streamui.dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "streamui - Streaming UI components for AI",
    description:
      "Beautiful streaming UI components for AI applications. Build progressive, real-time interfaces with React and AI SDK.",
    url: "https://streamui.dev",
    siteName: "streamui",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "streamui - Streaming UI components for AI",
    description:
      "Beautiful streaming UI components for AI applications. Build progressive, real-time interfaces with React and AI SDK.",
    creator: "@0xDecker",
    site: "@0xDecker",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
