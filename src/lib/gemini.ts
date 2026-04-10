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
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, type }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Search failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Search error:", error);
    return { results: [] };
  }
}
