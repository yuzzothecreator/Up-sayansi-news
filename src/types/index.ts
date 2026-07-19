import type {
  Advertisement,
  AuditLog,
  Bookmark,
  BookmarkCollection,
  Category,
  Comment,
  Follow,
  Like,
  Notification,
  Post,
  Profile,
  Report,
  Tag,
  User,
  View,
} from "@prisma/client";

export type {
  Advertisement,
  AuditLog,
  Bookmark,
  BookmarkCollection,
  Category,
  Comment,
  Follow,
  Like,
  Notification,
  Post,
  PostStatus,
  Profile,
  Report,
  Role,
  Tag,
  User,
  View,
  NotificationType,
  ReportReason,
  ReportStatus,
  AdvertisementPlacement,
  AuditAction,
} from "@prisma/client";

export type PostWithAuthor = Post & {
  author: Pick<User, "id" | "name" | "image" | "verified"> & {
    profile: Pick<Profile, "bio"> | null;
  };
};

export type PostWithRelations = PostWithAuthor & {
  category: Category | null;
  tags: Array<{ tag: Tag }>;
  _count?: {
    comments: number;
    likes: number;
    views: number;
  };
};

export type PostCard = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "subtitle"
  | "coverImage"
  | "publishedAt"
  | "readingTime"
  | "viewsCount"
  | "likesCount"
  | "commentsCount"
  | "featured"
> & {
  author: Pick<User, "id" | "name" | "image" | "verified">;
  category: Pick<Category, "id" | "name" | "slug" | "color"> | null;
};

export type CommentWithAuthor = Comment & {
  author: Pick<User, "id" | "name" | "image" | "verified">;
  replies?: CommentWithAuthor[];
  _count?: { likes: number };
};

export type UserProfile = User & {
  profile: Profile | null;
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
};

export type NotificationWithActor = Notification & {
  actor: Pick<User, "id" | "name" | "image"> | null;
};

export type BookmarkWithPost = Bookmark & {
  post: PostCard;
};

export type BookmarkCollectionWithItems = BookmarkCollection & {
  items: Array<{
    post: PostCard;
  }>;
  _count?: { items: number };
};

export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type SearchFilters = {
  query?: string;
  category?: string;
  tag?: string;
  author?: string;
  status?: Post["status"];
  featured?: boolean;
  sort?: "latest" | "popular" | "trending";
  page?: number;
  limit?: number;
};

export type TipTapContent = Record<string, unknown>;

export type UploadResult = {
  url: string;
  path: string;
  size: number;
  mimeType: string;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export type AuditLogEntry = AuditLog & {
  user: Pick<User, "id" | "name" | "email"> | null;
};

export type LikeTarget = "post" | "comment";

export type ReportTarget = {
  postId?: string;
  commentId?: string;
  targetUserId?: string;
};

export type SortDirection = "asc" | "desc";

export type EditorMode = "write" | "preview" | "split";
