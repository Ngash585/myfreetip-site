import { useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "react-router-dom";
import { getNewsArticles } from "@/lib/api";
import { getArticleImage } from "@/lib/articleImage";
import { useQuery } from "@tanstack/react-query";

const CATEGORIES = [
  "All",
  "Premier League",
  "Champions League",
  "Football",
  "Match Analysis",
  "Football Academy",
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
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse" style={{ boxShadow: 'rgba(29,29,29,0.08) 4px 16px 32px 0' }}>
      <div className="aspect-[16/9] bg-[#F2EEE9]" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-[#F2EEE9] rounded w-1/3" />
        <div className="h-4 bg-[#F2EEE9] rounded w-full" />
        <div className="h-4 bg-[#F2EEE9] rounded w-4/5" />
        <div className="h-3 bg-[#F2EEE9] rounded w-full mt-2" />
        <div className="h-3 bg-[#F2EEE9] rounded w-3/4" />
      </div>
    </div>
  );
}

export default function SportsNews() {
  usePageMeta({
    title: "Football Match Analysis and News \u2014 MyFreeTip",
    description:
      "In-depth football match previews, tactical analysis, and form guides covering Premier League, La Liga, Serie A, Bundesliga, Champions League and African leagues.",
    canonical: "https://myfreetip.com/sports-news",
  });
  const { data: articles = [], isLoading: loading } = useQuery({
    queryKey: ['news-articles'],
    queryFn: getNewsArticles,
  });
  const [activeCategory, setCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <div style={{ color: '#1D1D1D' }}>

      {/* Page header */}
      <div className="px-4 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(29,29,29,0.08)' }}>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, fontSize: '28px' }}>
          Sports News
        </h1>
        <p className="text-sm mt-1" style={{ color: '#777777' }}>
          Match analysis, predictions and big win stories
        </p>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3" style={{ borderBottom: '1px solid rgba(29,29,29,0.08)', scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={
              activeCategory === cat
                ? { background: '#3DB157', color: '#FFFFFF', border: '1px solid transparent' }
                : { background: '#F2EEE9', color: '#777777', border: '1px solid rgba(29,29,29,0.10)' }
            }
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
          <p className="col-span-full text-sm py-10 text-center" style={{ color: '#777777' }}>
            No articles in this category yet.
          </p>
        )}

        {!loading &&
          filtered.map((article, index) => (
            <Link
              key={article.id}
              to={`/sports-news/${article.slug}`}
              className="group bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-lg block"
              style={{ boxShadow: 'rgba(29,29,29,0.08) 4px 16px 32px 0' }}
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={getArticleImage(article)}
                  alt={`${article.title} — ${article.category ?? 'Sports'} | MyFreeTip`}
                  width={800}
                  height={450}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="font-semibold" style={{ color: '#2D9A47' }}>{article.category}</span>
                  <span style={{ color: '#AAAAAA' }}>· {timeAgo(article.published_at)}</span>
                </div>
                <h2 className="text-base font-bold leading-snug transition-colors" style={{ color: '#1D1D1D' }}>
                  {article.title}
                </h2>
                <p className="mt-2 text-sm line-clamp-3" style={{ color: '#777777' }}>
                  {article.excerpt}
                </p>
                <span className="mt-3 inline-block text-xs font-semibold" style={{ color: '#2D9A47' }}>
                  Read article →
                </span>
              </div>
            </Link>
          ))}
      </div>

    </div>
  );
}
