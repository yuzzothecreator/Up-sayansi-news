export const APP_NAME = "Pulse";

export const POST_STATUSES = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  SCHEDULED: "SCHEDULED",
  ARCHIVED: "ARCHIVED",
  PENDING_REVIEW: "PENDING_REVIEW",
} as const;

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;
export const MAX_COMMENT_LENGTH = 2000;
export const MAX_BIO_LENGTH = 500;
export const MAX_POST_TITLE_LENGTH = 200;
export const MAX_POST_SUBTITLE_LENGTH = 300;
export const MAX_SLUG_LENGTH = 200;
export const MAX_TAGS_PER_POST = 10;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export const RATE_LIMITS = {
  auth: { limit: 10, windowMs: 60_000 },
  comment: { limit: 20, windowMs: 60_000 },
  like: { limit: 60, windowMs: 60_000 },
  post: { limit: 10, windowMs: 60_000 },
  upload: { limit: 20, windowMs: 60_000 },
  search: { limit: 30, windowMs: 60_000 },
  newsletter: { limit: 5, windowMs: 60_000 },
} as const;

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  covers: "covers",
  posts: "post-images",
  media: "media",
} as const;

export const CACHE_TAGS = {
  posts: "posts",
  post: (slug: string) => `post:${slug}`,
  user: (id: string) => `user:${id}`,
  category: (slug: string) => `category:${slug}`,
  trending: "trending",
  featured: "featured",
} as const;

export const READING_WPM = 200;

export const SEO_DEFAULTS = {
  titleTemplate: "%s · Pulse",
  defaultTitle: "Pulse — Stories that move the world",
  defaultDescription:
    "Discover thoughtful stories on sports, culture, technology, and more on Pulse.",
} as const;

export const EDITOR_PLACEHOLDER = "Tell your story…";

export const NOTIFICATION_ICONS = {
  LIKE: "Heart",
  COMMENT: "MessageCircle",
  REPLY: "Reply",
  FOLLOW: "UserPlus",
  MENTION: "AtSign",
  POST_PUBLISHED: "Send",
  POST_APPROVED: "CheckCircle",
  POST_REJECTED: "XCircle",
  SYSTEM: "Bell",
} as const;

export const REPORT_REASONS = [
  "SPAM",
  "HARASSMENT",
  "HATE_SPEECH",
  "MISINFORMATION",
  "COPYRIGHT",
  "OTHER",
] as const;

export const AD_PLACEMENTS = [
  "HEADER",
  "SIDEBAR",
  "IN_FEED",
  "FOOTER",
  "ARTICLE_INLINE",
] as const;

export const AUTH_PROVIDERS = ["credentials", "google", "github"] as const;

export const COOKIE_NAMES = {
  theme: "pulse-theme",
  consent: "pulse-consent",
} as const;

export const API_ROUTES = {
  auth: "/api/auth",
  posts: "/api/posts",
  comments: "/api/comments",
  upload: "/api/upload",
  search: "/api/search",
  newsletter: "/api/newsletter",
} as const;
