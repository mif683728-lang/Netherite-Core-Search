import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // DuckDuckGo Search (No API Key required)
  app.post("/api/search", async (req, res) => {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    try {
      // Fetch from DuckDuckGo HTML version
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from DuckDuckGo");
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const results: any[] = [];

      $(".result").each((i, el) => {
        if (i >= 8) return; // Limit to 8 results

        const title = $(el).find(".result__title").text().trim();
        const link = $(el).find(".result__url").text().trim();
        const snippet = $(el).find(".result__snippet").text().trim();
        const fullLink = $(el).find(".result__a").attr("href");

        if (title && snippet) {
          results.push({
            title,
            link: fullLink ? (fullLink.startsWith("//") ? `https:${fullLink}` : fullLink) : `https://${link}`,
            snippet,
            displayLink: link
          });
        }
      });

      res.json({
        results,
        answer: results.length > 0 ? `Found ${results.length} results for "${query}" via DuckDuckGo.` : "No results found."
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to perform search" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
