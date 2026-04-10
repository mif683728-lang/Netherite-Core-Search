import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink?: string;
  pagemap?: any;
  image?: {
    url: string;
    thumbnailUrl?: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  answer?: string;
}

export async function performSearch(query: string, type: 'all' | 'images' | 'videos' = 'all'): Promise<SearchResponse> {
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
    return {
      results: data.results || [],
      answer: data.answer
    };
  } catch (error) {
    console.error("Search error:", error);
    return { results: [] };
  }
}
