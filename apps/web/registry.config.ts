import type { PluginOptions } from "fumadocs-registry";

export default {
  baseUrl: "https://streamui.dev/r",
  registry: {
    name: "streamui",
    homepage: "https://streamui.dev",
  },
  componentsDirs: [
    { name: "stream", type: "ui" },
    { name: "lib", type: "lib" },
  ],
  docsDirs: ["content/docs/stream"],
} satisfies PluginOptions;
