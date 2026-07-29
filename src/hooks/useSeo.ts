import { useEffect } from 'react';

export const SITE_URL = 'https://thecoconutisland.com';

const DEFAULT_TITLE = 'The Coconut Island | Sri Lankan Street Food & Cocktails';

interface SeoOptions {
  title: string;
  description: string;
  /** Route path, e.g. "/brighton" — used for canonical + og:url */
  path: string;
  /** Absolute or root-relative share image; falls back to the static og-image */
  image?: string;
  /** og:type — "article" for blog posts, defaults to "website" */
  type?: 'website' | 'article';
  /** Route-scoped structured data, injected as JSON-LD and removed on unmount */
  jsonLd?: object;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Per-route document metadata. Search engines executing JS (Google) see
 * these; link-preview scrapers do not run JS and read the static tags in
 * index.html instead.
 */
export function useSeo({ title, description, path, image, type = 'website', jsonLd }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', SITE_URL + path);
    setMeta('property', 'og:type', type);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (image) {
      const abs = image.startsWith('http') ? image : SITE_URL + image;
      setMeta('property', 'og:image', abs);
      setMeta('name', 'twitter:image', abs);
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = SITE_URL + path;

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.routeJsonld = '';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      script?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- jsonLd compared by content, not identity
  }, [title, description, path, image, type, JSON.stringify(jsonLd)]);
}
