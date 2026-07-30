export const siteConfig = {
  name: "UpSayansi News",
  tagline: "Stories that move the world",
  description:
    "UpSayansi News is a premium publishing platform for thoughtful writers and curious readers. Discover stories on sports, culture, technology, and beyond.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og-default.png",
  links: {
    twitter: "https://twitter.com/pulse",
    github: "https://github.com/pulse",
  },
  creator: {
    name: "UpSayansi News",
    url: "https://pulse.app",
  },
  keywords: [
    "blog",
    "publishing",
    "stories",
    "sports",
    "writing",
    "medium alternative",
  ],
  defaultLocale: "en",
  postsPerPage: 12,
  commentsPerPage: 20,
  maxUploadSizeMb: 5,
  supportedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
} as const;

export type SiteConfig = typeof siteConfig;
