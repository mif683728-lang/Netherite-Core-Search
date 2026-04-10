import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Image as ImageIcon, Video as VideoIcon, Info, Shield, FileText, HelpCircle, Newspaper, MoreHorizontal, LayoutGrid, PenTool, Type } from "lucide-react";
import SearchBar from "./components/SearchBar";
import ResultList from "./components/ResultList";
import FeaturedResult from "./components/FeaturedResult";
import Pagination from "./components/Pagination";
import Modal from "./components/Modal";
import { performSearch, SearchResult } from "./lib/gemini";

type SearchType = 'all' | 'images' | 'videos' | 'news';
type ModalType = 'none' | 'privacy' | 'terms' | 'about' | 'help';

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');

  const handleSearch = useCallback(async (searchQuery: string, type: SearchType = 'all', page: number = 1) => {
    if (!searchQuery) return;
    
    setIsLoading(true);
    setError(null);
    setQuery(searchQuery);
    setSearchType(type);
    setCurrentPage(page);
    setHasSearched(true);

    // Scroll to top on new search
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await performSearch(searchQuery, type, page);
      setResults(response.results);
      setAnswer(response.answer);
      if (response.results.length === 0 && !response.answer) {
        setError("The core could not find any results for this query.");
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError("An error occurred while searching the core. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isFeaturedQuery = (q: string) => {
    const normalized = q.toLowerCase();
    return normalized === 'netherite core' || normalized.includes('bot link');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden relative flex flex-col">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-pattern opacity-[0.05]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Light Streaks */}
        <div className="light-streak top-[10%] left-[20%] opacity-20" />
        <div className="light-streak top-[40%] right-[15%] opacity-10" />
        <div className="light-streak bottom-[20%] left-[10%] opacity-15" />
      </div>

      {/* Top Left Logo - Always Visible */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => {
          setHasSearched(false);
          setQuery("");
          setResults([]);
        }}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 cursor-pointer group flex items-center gap-2 md:gap-3"
      >
        <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#1a1a1e] border border-zinc-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-purple-600 rounded-sm rotate-45 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg md:text-2xl font-black tracking-tighter text-white leading-none">
            NETHERITE<span className="text-purple-500">CORE</span>
          </h2>
          <span className="text-[7px] md:text-[10px] text-purple-400 font-bold tracking-widest uppercase">The Future of Search</span>
        </div>
      </motion.div>

      <main className={`relative flex flex-col items-center transition-all duration-700 flex-1 ${hasSearched ? 'pt-20 md:pt-28' : 'justify-center'}`}>
        <div className={`w-full px-4 md:px-8 transition-all duration-700 ${hasSearched ? 'max-w-6xl' : 'max-w-4xl'}`}>
          
          {/* Header / Search Bar Area */}
          <div className={`flex flex-col items-center w-full ${hasSearched ? 'mb-6 md:mb-8' : ''}`}>
            {hasSearched && (
              <div className="w-full mb-6">
                <SearchBar 
                  onSearch={(q) => handleSearch(q, searchType, 1)} 
                  initialValue={query} 
                  isCompact 
                  isLoading={isLoading}
                />
              </div>
            )}
            
            {!hasSearched && (
              <div className="w-full flex flex-col items-center gap-8 md:gap-12">
                <div className="text-center mb-2 md:mb-4">
                  <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-none mb-3 md:mb-4">
                    Explore the <span className="text-purple-500">Core.</span>
                  </h1>
                  <p className="text-base md:text-xl text-zinc-500 font-medium tracking-tight">Search with the power of Netherite AI</p>
                </div>

                <SearchBar onSearch={(q) => handleSearch(q, 'all', 1)} isLoading={isLoading} />
                
                {/* Quick Links */}
                <div className="grid grid-cols-3 md:flex items-center gap-6 md:gap-10">
                  {[
                    { id: 'all', label: 'Web', icon: Globe },
                    { id: 'images', label: 'Images', icon: ImageIcon },
                    { id: 'videos', label: 'Videos', icon: VideoIcon },
                    { id: 'news', label: 'News', icon: Newspaper },
                    { id: 'more', label: 'More', icon: MoreHorizontal },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => item.id !== 'more' && handleSearch('', item.id as SearchType, 1)}
                      className="flex flex-col items-center gap-2 md:gap-3 group"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#1a1a1e] border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-purple-400 group-hover:border-purple-500/30 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all">
                        <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <span className="text-[10px] md:text-sm font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filters (Results Page) */}
            {hasSearched && (
              <div className="w-full flex items-center gap-1 border-b border-zinc-800/50 mb-8 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All', icon: Globe },
                  { id: 'images', label: 'Images', icon: ImageIcon },
                  { id: 'videos', label: 'Videos', icon: VideoIcon },
                  { id: 'news', label: 'News', icon: Newspaper },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleSearch(query, filter.id as SearchType, 1)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
                      searchType === filter.id ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <filter.icon className={`w-4 h-4 transition-transform ${searchType === filter.id ? 'scale-110' : ''}`} />
                    {filter.label}
                    {searchType === filter.id && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {hasSearched && (
              <motion.div
                key={`${query}-${searchType}-${currentPage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-3xl"
              >
                {/* Featured Result Logic */}
                {isFeaturedQuery(query) && currentPage === 1 && <FeaturedResult />}

                {/* AI Answer / Summary */}
                {answer && !isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-zinc-800 backdrop-blur-md shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-3 text-purple-400">
                      <Info className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Core Insight</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed italic">
                      {answer}
                    </p>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && !isLoading && (
                  <div className="text-center py-20">
                    <p className="text-zinc-500 text-lg">{error}</p>
                  </div>
                )}

                {!error && <ResultList results={results} isLoading={isLoading} type={searchType === 'news' ? 'all' : searchType} />}
                
                {!isLoading && results.length > 0 && (
                  <Pagination 
                    currentPage={currentPage} 
                    onPageChange={(page) => handleSearch(query, searchType, page)} 
                    hasMore={results.length >= 5} 
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className={`flex flex-col items-center md:items-end gap-1 py-6 md:py-8 px-6 md:px-12 transition-all ${hasSearched ? 'mt-auto' : 'fixed bottom-0 left-0 right-0 md:left-auto'}`}>
        <div className="flex gap-4 md:gap-6 text-zinc-500 text-sm font-medium">
          <button onClick={() => setActiveModal('about')} className="hover:text-purple-400 transition-colors">About</button>
          <button onClick={() => setActiveModal('privacy')} className="hover:text-purple-400 transition-colors">Privacy</button>
          <button onClick={() => setActiveModal('terms')} className="hover:text-purple-400 transition-colors">Terms</button>
          <button onClick={() => setActiveModal('help')} className="hover:text-purple-400 transition-colors">Help</button>
        </div>
        <p className="text-zinc-600 text-xs tracking-tight">Netherite Dynamics © 2024</p>
      </footer>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal('none')} 
        title="Privacy Policy"
      >
        <div className="space-y-4">
          <p>At Netherite Core, we prioritize your privacy. We do not store your search history or personal data on our servers.</p>
          <p>Our search results are powered by the Google Programmable Search Engine API via Gemini AI. Your queries are sent to these services to provide you with the most relevant information.</p>
          <p>We do not use tracking cookies or sell your data to third parties. Your search experience is clean, private, and secure.</p>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal('none')} 
        title="Terms of Service"
      >
        <div className="space-y-4">
          <p>By using Netherite Core, you agree to use our search engine for lawful purposes only.</p>
          <p>We provide search results "as is" and do not guarantee the accuracy or completeness of the information found through our service.</p>
          <p>Netherite Core is a tool designed to help you find information quickly and efficiently. We are not responsible for the content of external websites linked in our search results.</p>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'about'} 
        onClose={() => setActiveModal('none')} 
        title="About Netherite Core"
      >
        <div className="space-y-4">
          <p>Netherite Core is a next-generation search engine built for speed, privacy, and precision.</p>
          <p>Powered by advanced AI models and the Google Search index, we aim to provide the most relevant answers to your questions instantly.</p>
          <p>Our mission is to create a search experience that feels like using a high-end technical tool—powerful, reliable, and beautifully designed.</p>
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">Version 1.0.0 • Developed with ❤️ for the Core.</p>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'help'} 
        onClose={() => setActiveModal('none')} 
        title="Help Center"
      >
        <div className="space-y-4">
          <p>Need help with Netherite Core? Here are some quick tips:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the filters below the search bar to narrow down your results to Images, Videos, or News.</li>
            <li>Click on the logo to return to the home screen at any time.</li>
            <li>For specific queries about the Netherite Bot, try searching for "Netherite Core bot link".</li>
          </ul>
          <p>If you have further questions, feel free to reach out to our support team.</p>
        </div>
      </Modal>
    </div>
  );
}
