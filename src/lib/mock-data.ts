import type { PostCard, PostWithRelations, UserProfile } from "@/types";
import type { Category, Tag } from "@prisma/client";

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000);

export const mockAuthors: UserProfile[] = [
  {
    id: "mock-maya",
    name: "Maya Chen",
    email: "maya@pulse.app",
    emailVerified: true,
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=maya",
    createdAt: daysAgo(180),
    updatedAt: now,
    role: "AUTHOR",
    banned: false,
    banReason: null,
    banExpires: null,
    verified: true,
    profile: {
      id: "mock-profile-maya",
      userId: "mock-maya",
      bio: "Sports journalist covering football, basketball, and the stories behind the stats.",
      website: "https://pulse.app",
      twitter: "mayachen",
      github: null,
      location: "San Francisco, CA",
      coverImage: null,
      createdAt: daysAgo(180),
      updatedAt: now,
    },
    _count: { posts: 12, followers: 2840, following: 156 },
  },
  {
    id: "mock-marcus",
    name: "Marcus Rivera",
    email: "marcus@pulse.app",
    emailVerified: true,
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=marcus",
    createdAt: daysAgo(200),
    updatedAt: now,
    role: "AUTHOR",
    banned: false,
    banReason: null,
    banExpires: null,
    verified: true,
    profile: {
      id: "mock-profile-marcus",
      userId: "mock-marcus",
      bio: "Culture writer exploring music, film, and the edges of modern life.",
      website: "https://pulse.app",
      twitter: "marcusrivera",
      github: null,
      location: "Brooklyn, NY",
      coverImage: null,
      createdAt: daysAgo(200),
      updatedAt: now,
    },
    _count: { posts: 8, followers: 1920, following: 89 },
  },
  {
    id: "mock-sam",
    name: "Sam Okonkwo",
    email: "sam@pulse.app",
    emailVerified: true,
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=sam",
    createdAt: daysAgo(150),
    updatedAt: now,
    role: "AUTHOR",
    banned: false,
    banReason: null,
    banExpires: null,
    verified: true,
    profile: {
      id: "mock-profile-sam",
      userId: "mock-sam",
      bio: "Tech reporter focused on how innovation reshapes sport and society.",
      website: "https://pulse.app",
      twitter: "samokonkwo",
      github: "samok",
      location: "Austin, TX",
      coverImage: null,
      createdAt: daysAgo(150),
      updatedAt: now,
    },
    _count: { posts: 15, followers: 4100, following: 234 },
  },
];

export const mockCategories: Array<Category & { _count: { posts: number } }> = [
  {
    id: "mock-cat-sports",
    name: "Sports",
    slug: "sports",
    description: "Athletics, competition, and the human spirit of sport.",
    color: "#3b82f6",
    icon: "Trophy",
    createdAt: daysAgo(365),
    updatedAt: now,
    _count: { posts: 24 },
  },
  {
    id: "mock-cat-culture",
    name: "Culture",
    slug: "culture",
    description: "Music, film, art, and the stories that shape us.",
    color: "#a855f7",
    icon: "Palette",
    createdAt: daysAgo(365),
    updatedAt: now,
    _count: { posts: 18 },
  },
  {
    id: "mock-cat-tech",
    name: "Technology",
    slug: "technology",
    description: "Innovation, startups, and the future we're building.",
    color: "#06b6d4",
    icon: "Cpu",
    createdAt: daysAgo(365),
    updatedAt: now,
    _count: { posts: 21 },
  },
  {
    id: "mock-cat-opinion",
    name: "Opinion",
    slug: "opinion",
    description: "Perspectives that challenge and inspire.",
    color: "#f59e0b",
    icon: "MessageSquare",
    createdAt: daysAgo(365),
    updatedAt: now,
    _count: { posts: 12 },
  },
];

export const mockTags: Array<Tag & { _count: { posts: number } }> = [
  { id: "t1", name: "Football", slug: "football", createdAt: daysAgo(300), updatedAt: now, _count: { posts: 8 } },
  { id: "t2", name: "NBA", slug: "nba", createdAt: daysAgo(300), updatedAt: now, _count: { posts: 6 } },
  { id: "t3", name: "AI", slug: "ai", createdAt: daysAgo(300), updatedAt: now, _count: { posts: 10 } },
  { id: "t4", name: "Startups", slug: "startups", createdAt: daysAgo(300), updatedAt: now, _count: { posts: 7 } },
];

function mockPostCard(overrides: Partial<PostCard> & Pick<PostCard, "id" | "title" | "slug">): PostCard {
  return {
    subtitle: "A compelling story worth your time.",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    publishedAt: daysAgo(3),
    readingTime: 6,
    viewsCount: 4200,
    likesCount: 128,
    commentsCount: 24,
    featured: false,
    author: {
      id: mockAuthors[0].id,
      name: mockAuthors[0].name,
      image: mockAuthors[0].image,
      verified: true,
    },
    category: {
      id: mockCategories[0].id,
      name: mockCategories[0].name,
      slug: mockCategories[0].slug,
      color: mockCategories[0].color,
    },
    ...overrides,
  };
}

export const mockPostCards: PostCard[] = [
  mockPostCard({
    id: "mock-post-1",
    title: "The Last Dance: What Modern Athletes Can Learn from Jordan's Mindset",
    slug: "last-dance-modern-athletes-jordan-mindset",
    subtitle: "Beyond the highlights — the discipline that defined a generation.",
    coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    featured: true,
    viewsCount: 12400,
    likesCount: 892,
    author: { id: mockAuthors[0].id, name: mockAuthors[0].name, image: mockAuthors[0].image, verified: true },
    category: { id: mockCategories[0].id, name: "Sports", slug: "sports", color: "#3b82f6" },
  }),
  mockPostCard({
    id: "mock-post-2",
    title: "Why Vinyl Is Having Its Best Decade Since the 70s",
    slug: "vinyl-best-decade-since-70s",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    author: { id: mockAuthors[1].id, name: mockAuthors[1].name, image: mockAuthors[1].image, verified: true },
    category: { id: mockCategories[1].id, name: "Culture", slug: "culture", color: "#a855f7" },
  }),
  mockPostCard({
    id: "mock-post-3",
    title: "The AI Revolution in Sports Analytics",
    slug: "ai-revolution-sports-analytics",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    author: { id: mockAuthors[2].id, name: mockAuthors[2].name, image: mockAuthors[2].image, verified: true },
    category: { id: mockCategories[2].id, name: "Technology", slug: "technology", color: "#06b6d4" },
  }),
  mockPostCard({
    id: "mock-post-4",
    title: "Champions League Final: A Tactical Masterclass",
    slug: "champions-league-final-tactical-masterclass",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    publishedAt: daysAgo(1),
    viewsCount: 8900,
  }),
  mockPostCard({
    id: "mock-post-5",
    title: "Building in Public: Lessons from 100 Days of Shipping",
    slug: "building-in-public-100-days",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    publishedAt: daysAgo(5),
  }),
  mockPostCard({
    id: "mock-post-6",
    title: "The Rise of Women's Football Worldwide",
    slug: "rise-womens-football-worldwide",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    publishedAt: daysAgo(7),
  }),
];

export const mockFeaturedPosts = mockPostCards.filter((p) => p.featured);
export const mockTrendingPosts = [...mockPostCards].sort((a, b) => b.viewsCount - a.viewsCount);
export const mockPopularPosts = [...mockPostCards].sort((a, b) => b.likesCount - a.likesCount);

export const mockPostDetail: PostWithRelations = {
  id: mockPostCards[0].id,
  title: mockPostCards[0].title,
  slug: mockPostCards[0].slug,
  subtitle: mockPostCards[0].subtitle,
  content: {
    type: "doc",
    content: [
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "The Mindset That Changed Everything" }] },
      { type: "paragraph", content: [{ type: "text", text: "Michael Jordan didn't just play basketball — he redefined what it meant to compete. His relentless pursuit of excellence offers lessons that transcend sport." }] },
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Discipline Over Motivation" }] },
      { type: "paragraph", content: [{ type: "text", text: "Motivation is fleeting. Discipline is what separates champions from everyone else. Jordan's practice routines were legendary — arriving first, leaving last, every single day." }] },
      { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: "I've failed over and over and over again in my life. And that is why I succeed." }] }] },
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Applying the Framework Today" }] },
      { type: "paragraph", content: [{ type: "text", text: "Modern athletes have more tools than ever — data analytics, recovery science, mental coaching. But the core principle remains: show up, do the work, embrace the process." }] },
    ],
  },
  contentHtml: `<h2 id="the-mindset-that-changed-everything">The Mindset That Changed Everything</h2>
<p>Michael Jordan didn't just play basketball — he redefined what it meant to compete. His relentless pursuit of excellence offers lessons that transcend sport.</p>
<h2 id="discipline-over-motivation">Discipline Over Motivation</h2>
<p>Motivation is fleeting. Discipline is what separates champions from everyone else. Jordan's practice routines were legendary — arriving first, leaving last, every single day.</p>
<blockquote><p>I've failed over and over and over again in my life. And that is why I succeed.</p></blockquote>
<h2 id="applying-the-framework-today">Applying the Framework Today</h2>
<p>Modern athletes have more tools than ever — data analytics, recovery science, mental coaching. But the core principle remains: show up, do the work, embrace the process.</p>`,
  coverImage: mockPostCards[0].coverImage,
  status: "PUBLISHED",
  publishedAt: mockPostCards[0].publishedAt,
  scheduledAt: null,
  readingTime: 8,
  viewsCount: mockPostCards[0].viewsCount,
  likesCount: mockPostCards[0].likesCount,
  commentsCount: mockPostCards[0].commentsCount,
  featured: true,
  pinned: false,
  seoTitle: null,
  seoDescription: null,
  authorId: mockAuthors[0].id,
  categoryId: mockCategories[0].id,
  createdAt: daysAgo(10),
  updatedAt: now,
  author: {
    id: mockAuthors[0].id,
    name: mockAuthors[0].name,
    image: mockAuthors[0].image,
    verified: true,
    profile: { bio: mockAuthors[0].profile?.bio ?? null },
  },
  category: mockCategories[0],
  tags: [{ tag: mockTags[0] }, { tag: mockTags[1] }],
  _count: { comments: 24, likes: 892, views: 12400 },
};

export const mockTestimonials = [
  {
    quote: "Pulse transformed how I discover stories. The curation is impeccable.",
    author: "Sarah Kim",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=sarah",
  },
  {
    quote: "Finally, a platform that treats writers and readers with equal respect.",
    author: "David Torres",
    role: "Independent Author",
    avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=david",
  },
  {
    quote: "The reading experience is unmatched. Clean, fast, and beautifully designed.",
    author: "Emma Walsh",
    role: "Editor at TechReview",
    avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=emma",
  },
];

export const mockFaqs = [
  {
    question: "What is Pulse?",
    answer: "Pulse is a premium publishing platform for thoughtful writers and curious readers. We focus on quality storytelling across sports, culture, technology, and beyond.",
  },
  {
    question: "Is Pulse free to read?",
    answer: "Yes! All published stories on Pulse are free to read. We believe great writing should be accessible to everyone.",
  },
  {
    question: "How do I become a writer on Pulse?",
    answer: "Create an account and apply to become an author. Our editorial team reviews applications and welcomes diverse voices.",
  },
  {
    question: "Can I save articles for later?",
    answer: "Absolutely. Sign in and use the bookmark feature to build your personal reading library.",
  },
  {
    question: "How does the newsletter work?",
    answer: "Subscribe with your email to receive weekly curated picks — the best stories, hand-selected by our editors.",
  },
];

export const mockPaginationMeta = {
  page: 1,
  limit: 12,
  total: mockPostCards.length,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};
