import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Serves the generator API during `npm run dev` and `npm run preview`, so the same
 * endpoint exists locally as in production without running a second process.
 *
 * `env` is loaded with an empty prefix and passed in explicitly, because Vite
 * only puts `VITE_`-prefixed values on `process.env` — and the API key must
 * never carry that prefix, since those are bundled into the browser.
 */
function generateApi(env) {
  const middleware = async (req, res, next) => {
    if (!req.url?.startsWith("/api/generate")) return next();

    const { handleGenerate } = await import("./api/_generate-core.js");

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const request = new Request(`http://localhost${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
    });

    // A real shell variable wins over the file, matching how hosting platforms
    // inject secrets.
    const response = await handleGenerate(request, { ...env, ...process.env });
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(await response.text());
  };

  // Block bodies on purpose: returning the value of `use()` would make Vite
  // treat it as the post-hook and call it with no arguments.
  return {
    name: "generate-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => ({
  // The empty prefix loads every variable in .env, not just the VITE_ ones.
  plugins: [
    react(),
    tailwindcss(),
    generateApi(loadEnv(mode, process.cwd(), "")),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // The spreadsheet parser is only needed when someone actually picks
          // Excel. Naming it here keeps it out of the shared vendor chunk, so
          // the dynamic import in the converter stays a real lazy load.
          if (id.includes("node_modules/xlsx")) return "xlsx";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
}));
