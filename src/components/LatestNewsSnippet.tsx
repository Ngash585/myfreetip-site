import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { NewsArticle } from "@/lib/api";
import { getNewsArticles } from "@/lib/api";

const CATEGORY_ICON: Record<string, string> = {
  "Premier League":   "⚽",
  "Champions League": "🏆",
  "Football":         "⚽",
  "Betting Tips":     "💡",
  "Betting Academy":  "📚",
  "Big Wins":         "🏆",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function LatestNewsSnippet() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    getNewsArticles()
      .then((all) => setArticles(all.slice(0, 3)))
      .catch(() => setArticles([]));
  }, []);

  if (articles.length === 0) return null;

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
            Latest news
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none">
            Football News
          </h2>
        </div>
        <Link
          to="/sports-news"
          className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
        >
          All articles →
        </Link>
      </div>

      {/* Article grid — stacked on mobile, 3-col on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/sports-news/${article.slug}`}
            className="group flex flex-col bg-[#1a2634] rounded-2xl overflow-hidden border border-[#2a3a4a] hover:border-emerald-500/40 transition-colors"
          >
            {/* Cover image / icon */}
            <div className="h-36 w-full flex-shrink-0 overflow-hidden bg-[#0f1923]">
              {article.cover_url ? (
                <img
                  src={article.cover_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                  {CATEGORY_ICON[article.category] ?? "📰"}
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex flex-col flex-1 p-4 gap-1.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                {article.category}
              </p>
              <p className="text-sm font-bold text-white leading-snug line-clamp-3 flex-1">
                {article.title}
              </p>
              <p className="text-xs text-white/35 mt-1">
                {formatDate(article.published_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
