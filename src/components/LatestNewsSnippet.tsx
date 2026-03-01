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

function Thumbnail({ article }: { article: NewsArticle }) {
  if (article.cover_url) {
    return (
      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src={article.cover_url}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-[#0f1923] border border-[#2a3a4a] flex items-center justify-center text-2xl">
      {CATEGORY_ICON[article.category] ?? "📰"}
    </div>
  );
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
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Latest news
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white leading-none">
            Football News
          </h2>
        </div>
        <Link
          to="/sports-news"
          className="text-sm font-semibold text-emerald-400 hover:underline whitespace-nowrap"
        >
          All articles →
        </Link>
      </div>

      {/* Article rows */}
      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/sports-news/${article.slug}`}
            className="flex items-center gap-4 bg-[#1a2634] rounded-2xl p-4 hover:ring-1 hover:ring-emerald-500/40 transition"
          >
            <Thumbnail article={article} />

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                {article.category}
              </p>
              <p className="text-sm font-bold text-white leading-snug line-clamp-2">
                {article.title}
              </p>
              <p className="text-xs text-[#8a9bb0] mt-1">
                {formatDate(article.published_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
