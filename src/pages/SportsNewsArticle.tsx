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
      <div className="h-4 bg-[#F2EEE9] rounded w-24 mb-6" />
      <div className="aspect-[16/9] bg-[#F2EEE9] rounded-2xl mb-6" />
      <div className="h-3 bg-[#F2EEE9] rounded w-32 mb-3" />
      <div className="h-7 bg-[#F2EEE9] rounded w-full mb-2" />
      <div className="h-7 bg-[#F2EEE9] rounded w-3/4 mb-6" />
      <div className="h-4 bg-[#F2EEE9] rounded w-full mb-2" />
      <div className="h-4 bg-[#F2EEE9] rounded w-full mb-2" />
      <div className="h-4 bg-[#F2EEE9] rounded w-5/6 mb-8" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-[#F2EEE9] rounded w-full" />
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

    return () => {
      document.title = "MyFreeTip";
    };
  }, [slug]);

  if (loading) return <ArticleDetailSkeleton />;

  if (notFound || !article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center" style={{ color: '#1D1D1D' }}>
        <p className="text-4xl mb-4">⚽</p>
        <h1 className="text-xl font-bold mb-2">Article not found</h1>
        <p className="text-sm mb-6" style={{ color: '#777777' }}>
          This article may have been removed or the link is incorrect.
        </p>
        <Link to="/sports-news" className="font-semibold hover:underline" style={{ color: '#2D9A47' }}>
          ← Back to Sports News
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-6" style={{ color: '#1D1D1D' }}>

      {/* Back link */}
      <Link
        to="/sports-news"
        className="inline-flex items-center gap-1 text-sm hover:underline mb-6"
        style={{ color: '#2D9A47' }}
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
        <span className="font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(61,177,87,0.12)', color: '#2D9A47' }}>
          {article.category}
        </span>
        <span style={{ color: '#777777' }}>{timeAgo(article.published_at)}</span>
        {article.author && (
          <span style={{ color: '#777777' }}>· by {article.author}</span>
        )}
      </div>

      {/* Title */}
      <h1
        className="leading-tight mb-4"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '1.75rem', fontWeight: 400, color: '#1D1D1D' }}
      >
        {article.title}
      </h1>

      {/* Excerpt / standfirst */}
      <p className="text-base leading-relaxed border-l-2 pl-4 mb-8" style={{ color: '#4F4841', borderColor: '#3DB157' }}>
        {article.excerpt}
      </p>

      {/* Body paragraphs */}
      <div className="space-y-5">
        {article.body
          .split("\n\n")
          .map((para) => para.trim())
          .filter(Boolean)
          .map((para, i) => (
            <p key={i} className="leading-relaxed" style={{ color: '#4F4841' }}>
              {para}
            </p>
          ))}
      </div>

      {/* Affiliate CTA */}
      {article.affiliate_url && (
        <div
          className="mt-10 p-5 rounded-2xl"
          style={{ background: '#FFFFFF', boxShadow: 'rgba(29,29,29,0.08) 4px 16px 32px 0', border: '1px solid rgba(29,29,29,0.08)' }}
        >
          <p className="text-sm mb-3" style={{ color: '#777777' }}>Ready to place your bet?</p>
          <a
            href={article.affiliate_url}
            target="_blank"
            rel="noreferrer noopener"
            className="block text-center text-white font-bold py-3 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: '#080A2D' }}
          >
            {article.affiliate_label || "Bet Now"}
          </a>
        </div>
      )}

      {/* Back link footer */}
      <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(29,29,29,0.08)' }}>
        <Link to="/sports-news" className="text-sm hover:underline" style={{ color: '#2D9A47' }}>
          ← More articles
        </Link>
      </div>

    </article>
  );
}
