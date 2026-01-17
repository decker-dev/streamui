import { StreamingMinecraftDemo } from "@/registry/stream/streaming-minecraft-demo";

export default function MinecraftDemoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <StreamingMinecraftDemo />
    </main>
  );
}
