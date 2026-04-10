import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  isCompact?: boolean;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, initialValue = "", isCompact = false, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className={`w-full transition-all duration-500 ${isCompact ? 'max-w-3xl' : 'max-w-2xl'}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`absolute -inset-1 bg-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500 ${isFocused ? 'opacity-100' : ''}`}></div>
        <div className={`relative flex items-center bg-[#1a1a1e]/80 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 ${isFocused ? 'border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.2)]' : ''}`}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Explore the Core..."
            className="flex-1 pl-4 md:pl-6 pr-2 py-3 md:py-4 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg md:text-xl min-w-0 font-medium"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => setQuery("")}
                className="p-1 md:p-2 text-zinc-500 hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            )}
          </AnimatePresence>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="p-3 md:p-4 text-zinc-400 hover:text-purple-400 transition-all active:scale-95 shrink-0 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
