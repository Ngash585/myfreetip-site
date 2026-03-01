import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { NewsArticle } from "@/lib/api";
import { getNewsArticles } from "@/lib/api";

const CATEGORIES = [
  "All",
  "Premier League",
  "Champions League",
  "Football",
  "Betting Tips",
  "Betting Academy",
  "Big Wins",
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ArticleSkeleton() {
  return (
    <div className="bg-[#1a2634] rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-[#2a3a4a]" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-[#2a3a4a] rounded w-1/3" />
        <div className="h-4 bg-[#2a3a4a] rounded w-full" />
        <div className="h-4 bg-[#2a3a4a] rounded w-4/5" />
        <div className="h-3 bg-[#2a3a4a] rounded w-full mt-2" />
        <div className="h-3 bg-[#2a3a4a] rounded w-3/4" />
      </div>
    </div>
  );
}

export default function SportsNews() {
  const [articles, setArticles]       = useState<NewsArticle[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setCategory] = useState("All");

  useEffect(() => {
    document.title = "Sports News | MyFreeTip";
    getNewsArticles()
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="text-white">

      {/* Page header */}
      <div className="px-4 pt-6 pb-4 border-b border-[#2a3a4a]">
        <h1 className="text-2xl font-bold">Sports News</h1>
        <p className="text-sm text-[#8a9bb0] mt-1">
          Betting tips, analysis and big win stories
        </p>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-[#2a3a4a]"
           style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={[
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
              activeCategory === cat
                ? "bg-emerald-500 text-white"
                : "bg-[#1a2634] text-[#8a9bb0] hover:text-white border border-[#2a3a4a]",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading && (
          <>
            <ArticleSkeleton />
            <ArticleSkeleton />
            <ArticleSkeleton />
            <ArticleSkeleton />
          </>
        )}

        {!loading && filtered.length === 0 && (
          <p className="col-span-full text-[#8a9bb0] text-sm py-10 text-center">
            No articles in this category yet.
          </p>
        )}

        {!loading &&
          filtered.map((article) => (
            <Link
              key={article.id}
              to={`/sports-news/${article.slug}`}
              className="group bg-[#1a2634] rounded-2xl overflow-hidden hover:ring-1 hover:ring-emerald-500/40 transition"
            >
              {article.cover_url ? (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={article.cover_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-[#2a3a4a] flex items-center justify-center">
                  <span className="text-3xl opacity-20">⚽</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="text-emerald-400 font-semibold">{article.category}</span>
                  <span className="text-[#8a9bb0]">· {timeAgo(article.published_at)}</span>
                </div>
                <h2 className="text-base font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-[#8a9bb0] line-clamp-3">
                  {article.excerpt}
                </p>
                <span className="mt-3 inline-block text-xs font-semibold text-emerald-400">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
      </div>

    </div>
  );
}
