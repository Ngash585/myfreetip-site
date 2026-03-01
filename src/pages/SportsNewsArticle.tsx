import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { NewsArticle } from "@/lib/api";
import { getNewsArticle } from "@/lib/api";

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

function ArticleDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse">
      <div className="h-4 bg-[#1a2634] rounded w-24 mb-6" />
      <div className="aspect-[16/9] bg-[#1a2634] rounded-2xl mb-6" />
      <div className="h-3 bg-[#1a2634] rounded w-32 mb-3" />
      <div className="h-7 bg-[#1a2634] rounded w-full mb-2" />
      <div className="h-7 bg-[#1a2634] rounded w-3/4 mb-6" />
      <div className="h-4 bg-[#1a2634] rounded w-full mb-2" />
      <div className="h-4 bg-[#1a2634] rounded w-full mb-2" />
      <div className="h-4 bg-[#1a2634] rounded w-5/6 mb-8" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-[#1a2634] rounded w-full" />
        ))}
      </div>
    </div>
  );
}

export default function SportsNewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    getNewsArticle(slug)
      .then((a) => {
        if (!a) { setNotFound(true); return; }
        setArticle(a);

        // SEO: update page title and meta description
        document.title = `${a.title} | MyFreeTip`;
        let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "description";
          document.head.appendChild(meta);
        }
        meta.content = a.excerpt;
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    // Reset title on unmount
    return () => {
      document.title = "MyFreeTip";
    };
  }, [slug]);

  if (loading) return <ArticleDetailSkeleton />;

  if (notFound || !article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-white">
        <p className="text-4xl mb-4">⚽</p>
        <h1 className="text-xl font-bold mb-2">Article not found</h1>
        <p className="text-[#8a9bb0] text-sm mb-6">
          This article may have been removed or the link is incorrect.
        </p>
        <Link to="/sports-news" className="text-emerald-400 font-semibold hover:underline">
          ← Back to Sports News
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-6 text-white">

      {/* Back link */}
      <Link
        to="/sports-news"
        className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:underline mb-6"
      >
        ← Sports News
      </Link>

      {/* Cover image */}
      {article.cover_url && (
        <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-6">
          <img
            src={article.cover_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
        <span className="bg-emerald-500/15 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
          {article.category}
        </span>
        <span className="text-[#8a9bb0]">{timeAgo(article.published_at)}</span>
        {article.author && (
          <span className="text-[#8a9bb0]">· by {article.author}</span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold leading-tight mb-4">{article.title}</h1>

      {/* Excerpt / standfirst */}
      <p className="text-base text-[#8a9bb0] leading-relaxed border-l-2 border-emerald-500 pl-4 mb-8">
        {article.excerpt}
      </p>

      {/* Body — each \n\n becomes a paragraph */}
      <div className="space-y-5">
        {article.body
          .split("\n\n")
          .map((para) => para.trim())
          .filter(Boolean)
          .map((para, i) => (
            <p key={i} className="text-[#cbd5e1] leading-relaxed">
              {para}
            </p>
          ))}
      </div>

      {/* Affiliate CTA */}
      {article.affiliate_url && (
        <div className="mt-10 p-5 bg-[#1a2634] rounded-2xl border border-[#2a3a4a]">
          <p className="text-sm text-[#8a9bb0] mb-3">Ready to place your bet?</p>
          <a
            href={article.affiliate_url}
            target="_blank"
            rel="noreferrer noopener"
            className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition"
          >
            {article.affiliate_label || "Bet Now"}
          </a>
        </div>
      )}

      {/* Back link footer */}
      <div className="mt-10 pt-6 border-t border-[#2a3a4a]">
        <Link
          to="/sports-news"
          className="text-sm text-emerald-400 hover:underline"
        >
          ← More articles
        </Link>
      </div>

    </article>
  );
}
