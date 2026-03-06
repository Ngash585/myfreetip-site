import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
}

const DEFAULT_TITLE = "MyFreeTip \u2014 Free Daily Football Predictions and Match Analysis";
const DEFAULT_DESC =
  "Free daily football match analysis, confidence-based predictions, and transparent results. Full record published including missed calls. No noise, just analysis.";

export function usePageMeta({ title, description, canonical }: PageMeta) {
  useEffect(() => {
    document.title = title;

    const metaDesc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (metaDesc) metaDesc.content = description;

    const linkCanonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (linkCanonical && canonical) linkCanonical.href = canonical;

    return () => {
      document.title = DEFAULT_TITLE;
      if (metaDesc) metaDesc.content = DEFAULT_DESC;
    };
  }, [title, description, canonical]);
}
