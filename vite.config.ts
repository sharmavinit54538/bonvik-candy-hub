import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command, mode }) => {
  // Inject all VITE_* env vars so they're available via import.meta.env
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: envDefine,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    plugins: [
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackStart({
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
      }),
      viteReact(),
      ...(command === "build"
        ? [
            nitro({
              preset:
                process.env.NITRO_PRESET ||
                (process.env.CLOUDFLARE || process.env.CF_PAGES ? "cloudflare-module" : "vercel"),
            }),
          ]
        : []),
    ],
    server: {
      host: "::",
      port: 8080,
    },
  };
});
