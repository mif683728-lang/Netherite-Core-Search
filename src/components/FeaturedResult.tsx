import React from "react";
import { motion } from "motion/react";
import { ExternalLink, MessageSquare } from "lucide-react";

export default function FeaturedResult() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mb-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/30 backdrop-blur-md shadow-2xl shadow-purple-500/10"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40">
          <MessageSquare className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Featured Result</span>
            <div className="h-1 w-1 rounded-full bg-purple-400/50" />
            <span className="text-xs text-purple-300/60">Instant Answer</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Invite the Netherite Core Bot to your server!</h3>
          <p className="text-purple-200/70 text-sm mb-4 leading-relaxed">
            Enhance your Discord experience with Netherite Core. Powerful search, moderation, and utility features all in one bot.
          </p>
          <a
            href="https://discord.com/oauth2/authorize?client_id=1476972192788123678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
          >
            Add to Discord
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
