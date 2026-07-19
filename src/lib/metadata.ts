import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { SEO_DEFAULTS } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
  image = siteConfig.ogImage,
  noIndex = false,
  keywords,
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title
    ? SEO_DEFAULTS.titleTemplate.replace("%s", title)
    : SEO_DEFAULTS.defaultTitle;
  const url = absoluteUrl(path);
  const ogImage = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: pageTitle,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: siteConfig.defaultLocale,
      url,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
      creator: siteConfig.links.twitter,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function createArticleMetadata(options: {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
  publishedAt?: Date | string | null;
  author?: string;
  tags?: string[];
}): Metadata {
  const base = createMetadata({
    title: options.title,
    description: options.description,
    path: options.path,
    image: options.image ?? siteConfig.ogImage,
    keywords: options.tags,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: options.publishedAt
        ? new Date(options.publishedAt).toISOString()
        : undefined,
      authors: options.author ? [options.author] : undefined,
      tags: options.tags,
    },
  };
}
