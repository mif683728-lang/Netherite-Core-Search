import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // API Routes
  app.post("/api/search", async (req, res) => {
    const { query, type } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    try {
      const searchTypes: any = {
        webSearch: {},
      };

      let prompt = `You are a search engine. Search for: ${query}. 
      Return a JSON object with a "results" array containing 5-8 objects. 
      Each object must have "title", "link", and "snippet". 
      Also provide a brief "answer" summarizing the findings.`;
      
      if (type === 'images') {
        prompt = `Search for images related to: ${query}. 
        Return a JSON object with a "results" array. 
        Each object must have "title", "link" (the image URL), and "snippet".`;
      } else if (type === 'videos') {
        prompt = `Search for videos related to: ${query}. 
        Return a JSON object with a "results" array. 
        Each object must have "title", "link" (the video URL), and "snippet".`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          tools: [
            {
              googleSearch: {
                searchTypes
              },
            },
          ],
          toolConfig: { includeServerSideToolInvocations: true },
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              results: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    title: { type: "STRING" },
                    link: { type: "STRING" },
                    snippet: { type: "STRING" },
                    displayLink: { type: "STRING" },
                    image: {
                      type: "OBJECT",
                      properties: {
                        url: { type: "STRING" },
                        thumbnailUrl: { type: "STRING" }
                      }
                    }
                  },
                  required: ["title", "link", "snippet"]
                }
              },
              answer: { type: "STRING", description: "Ultra-brief summary" }
            },
            required: ["results"]
          }
        },
      });

      let text = response.text || "{}";
      // Remove markdown code blocks if present
      if (text.includes("```json")) {
        text = text.split("```json")[1].split("```")[0];
      } else if (text.includes("```")) {
        text = text.split("```")[1].split("```")[0];
      }
      
      const data = JSON.parse(text.trim());
      res.json({
        results: data.results || [],
        answer: data.answer
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
