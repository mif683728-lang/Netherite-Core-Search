import React from "react";
import { motion } from "motion/react";
import { SearchResult } from "../lib/gemini";
import { ExternalLink, Image as ImageIcon, Video as VideoIcon } from "lucide-react";

interface ResultCardProps {
  result: SearchResult;
  index: number;
  key?: React.Key;
}

export function ResultCard({ result, index }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group p-5 rounded-xl hover:bg-zinc-900/50 transition-all border border-transparent hover:border-zinc-800"
    >
      <div className="flex gap-4">
        {result.image && (
          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
            <img 
              src={result.image.url} 
              alt={result.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-zinc-500 truncate max-w-[200px]">{result.displayLink || new URL(result.link).hostname}</span>
          </div>
          <a 
            href={result.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-xl font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors mb-2 truncate"
          >
            {result.title}
          </a>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
            {result.snippet}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface ResultListProps {
  results: SearchResult[];
  isLoading: boolean;
  type: 'all' | 'images' | 'videos';
}

export default function ResultList({ results, isLoading, type }: ResultListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-4 p-5">
            <div className="w-24 h-24 bg-zinc-800 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
              <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0 && !isLoading) {
    return null;
  }

  if (type === 'images') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((result, i) => (
          <motion.a
            key={i}
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900"
          >
            <img 
              src={result.image?.url || result.link} 
              alt={result.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
              <p className="text-xs text-white font-medium truncate">{result.title}</p>
              <p className="text-[10px] text-zinc-400 truncate">{result.displayLink}</p>
            </div>
          </motion.a>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result, i) => (
        <ResultCard key={i} result={result} index={i} />
      ))}
    </div>
  );
}
