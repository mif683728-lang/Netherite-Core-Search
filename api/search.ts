import { load } from "cheerio";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from DuckDuckGo");
    }

    const html = await response.text();
    const $ = load(html);
    const results: any[] = [];

    $(".result").each((i, el) => {
      if (i >= 10) return;

      const titleEl = $(el).find(".result__title");
      const title = titleEl.text().trim();
      const snippet = $(el).find(".result__snippet").text().trim();
      const linkEl = $(el).find(".result__a");
      const fullLink = linkEl.attr("href");
      const displayLink = $(el).find(".result__url").text().trim();

      if (title && snippet) {
        results.push({
          title,
          link: fullLink ? (fullLink.startsWith("//") ? `https:${fullLink}` : fullLink) : `https://${displayLink}`,
          snippet,
          displayLink: displayLink || "duckduckgo.com"
        });
      }
    });

    return res.status(200).json({
      results,
      answer: results.length > 0 ? `Found ${results.length} results for "${query}" via DuckDuckGo.` : "No results found."
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: 'Failed to perform search' });
  }
}
