import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getNewsArticle } from "@/lib/api";
import { getArticleImage } from "@/lib/articleImage";
import { useQuery } from "@tanstack/react-query";

const SITE_URL = "https://myfreetip.com";
const SITE_NAME = "MyFreeTip";

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

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function removeMeta(name: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  document.querySelector(`meta[${attr}="${name}"]`)?.remove();
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

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['news-article', slug],
    queryFn: () => getNewsArticle(slug!),
    enabled: !!slug,
  });

  const notFound = !isLoading && (isError || article === null);

  useEffect(() => {
    if (!article) return;

    const articleUrl = `${SITE_URL}/sports-news/${article.slug}`;
    const imageUrl = `${SITE_URL}${getArticleImage(article)}`;
    const pageTitle = `${article.title} \u2014 ${SITE_NAME}`;

    // Basic
    document.title = pageTitle;
    setMeta("description", article.excerpt);

    // Canonical
    const linkCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (linkCanonical) linkCanonical.href = articleUrl;

    // Open Graph
    setMeta("og:type", "article", true);
    setMeta("og:url", articleUrl, true);
    setMeta("og:title", pageTitle, true);
    setMeta("og:description", article.excerpt, true);
    setMeta("og:image", imageUrl, true);
    setMeta("og:image:width", "1600", true);
    setMeta("og:image:height", "900", true);
    setMeta("og:site_name", SITE_NAME, true);

    // Twitter / X
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", article.excerpt);
    setMeta("twitter:image", imageUrl);

    // Article-specific OG
    setMeta("article:published_time", article.published_at, true);
    if (article.author) setMeta("article:author", article.author, true);

    // JSON-LD structured data (NewsArticle)
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.excerpt,
      "image": imageUrl,
      "datePublished": article.published_at,
      "dateModified": article.published_at,
      "url": articleUrl,
      "author": {
        "@type": "Person",
        "name": article.author ?? SITE_NAME,
      },
      "publisher": {
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/brand/app-icon-512.png`,
        },
      },
      "articleSection": article.category,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl,
      },
    };

    let script = document.querySelector<HTMLScriptElement>('script[data-article-jsonld]');
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-article-jsonld", "");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    return () => {
      // Restore defaults on unmount
      document.title = `${SITE_NAME} \u2014 Free Daily Football Predictions and Match Analysis`;
      if (linkCanonical) linkCanonical.href = `${SITE_URL}/`;
      removeMeta("og:type", true);
      removeMeta("og:url", true);
      removeMeta("og:title", true);
      removeMeta("og:description", true);
      removeMeta("og:image", true);
      removeMeta("og:image:width", true);
      removeMeta("og:image:height", true);
      removeMeta("article:published_time", true);
      removeMeta("article:author", true);
      document.querySelector('script[data-article-jsonld]')?.remove();
    };
  }, [article]);

  if (isLoading) return <ArticleDetailSkeleton />;

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

      {/* Hero image — always shown, fetchpriority=high for LCP */}
      <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-6">
        <img
          src={getArticleImage(article)}
          alt={`${article.title} — ${article.category ?? 'Sports'} | ${SITE_NAME}`}
          width={1600}
          height={900}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

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
          <p className="text-sm mb-3" style={{ color: '#777777' }}>Ready to back this?</p>
          <a
            href={article.affiliate_url}
            target="_blank"
            rel="noreferrer noopener"
            className="block text-center text-white font-bold py-3 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: '#080A2D' }}
          >
            {article.affiliate_label || "Back This Now"}
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
