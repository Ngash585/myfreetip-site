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
          <p
            className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: '#3DB157' }}
          >
            Latest news
          </p>
          <h2
            className="leading-none tracking-[-0.03em]"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '36px', color: '#1D1D1D', fontWeight: 400 }}
          >
            Football News
          </h2>
        </div>
        <Link
          to="/sports-news"
          className="text-sm font-medium transition-opacity hover:opacity-70 whitespace-nowrap"
          style={{ color: '#3DB157' }}
        >
          All articles →
        </Link>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/sports-news/${article.slug}`}
            className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              background: '#FFFFFF',
              boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'rgba(29, 29, 29, 0.13) 4px 20px 40px 0px';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px';
            }}
          >
            {/* Cover */}
            <div className="h-36 w-full overflow-hidden" style={{ background: '#F2EEE9' }}>
              {article.cover_url ? (
                <img
                  src={article.cover_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-25">
                  {CATEGORY_ICON[article.category] ?? "📰"}
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex flex-col flex-1 p-5 gap-2">
              <p
                className="text-[11px] font-medium uppercase tracking-widest"
                style={{ color: '#3DB157' }}
              >
                {article.category}
              </p>
              <p
                className="text-sm font-medium leading-snug line-clamp-3 flex-1"
                style={{ color: '#1D1D1D', fontWeight: 500 }}
              >
                {article.title}
              </p>
              <p className="text-xs mt-1" style={{ color: '#777777' }}>
                {formatDate(article.published_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
