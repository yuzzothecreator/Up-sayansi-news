import { PrismaClient, type Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { hashPassword } from "better-auth/crypto";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Password123!";

function tipTapDoc(...paragraphs: string[]): Prisma.InputJsonValue {
  return {
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  } as Prisma.InputJsonValue;
}

function htmlFromParagraphs(...paragraphs: string[]) {
  return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
}

async function createUserWithCredentials(options: {
  name: string;
  email: string;
  role: "READER" | "AUTHOR" | "EDITOR" | "ADMINISTRATOR";
  verified?: boolean;
  bio?: string;
  image?: string;
}) {
  // bcryptjs hash stored for reference; better-auth scrypt hash used for login
  const bcryptHash = await hash(DEMO_PASSWORD, 10);
  const authHash = await hashPassword(DEMO_PASSWORD);

  const user = await prisma.user.create({
    data: {
      name: options.name,
      email: options.email,
      emailVerified: true,
      role: options.role,
      verified: options.verified ?? options.role !== "READER",
      image: options.image,
      profile: {
        create: {
          bio: options.bio,
          location: "San Francisco, CA",
          website: "https://pulse.app",
          twitter: options.name.toLowerCase().replace(/\s+/g, ""),
        },
      },
      accounts: {
        create: {
          accountId: options.email,
          providerId: "credential",
          password: authHash,
        },
      },
    },
  });

  // Store bcrypt reference in audit metadata for demo documentation
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CREATE",
      entityType: "user",
      entityId: user.id,
      metadata: { bcryptReference: bcryptHash.slice(0, 20) + "…", demoPassword: DEMO_PASSWORD },
    },
  });

  return user;
}

async function main() {
  console.log("🌱 Seeding Pulse database…");

  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.view.deleteMany();
  await prisma.like.deleteMany();
  await prisma.bookmarkCollectionItem.deleteMany();
  await prisma.bookmarkCollection.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.advertisement.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const admin = await createUserWithCredentials({
    name: "Alex Morgan",
    email: "admin@pulse.app",
    role: "ADMINISTRATOR",
    bio: "Platform administrator keeping Pulse running smoothly.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  });

  const editor = await createUserWithCredentials({
    name: "Jordan Lee",
    email: "editor@pulse.app",
    role: "EDITOR",
    bio: "Senior editor curating the best stories on Pulse.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=editor",
  });

  const authors = await Promise.all([
    createUserWithCredentials({
      name: "Maya Chen",
      email: "maya@pulse.app",
      role: "AUTHOR",
      bio: "Sports journalist covering football, basketball, and the stories behind the stats.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
    }),
    createUserWithCredentials({
      name: "Marcus Rivera",
      email: "marcus@pulse.app",
      role: "AUTHOR",
      bio: "Culture writer exploring music, film, and the edges of modern life.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    }),
    createUserWithCredentials({
      name: "Sam Okonkwo",
      email: "sam@pulse.app",
      role: "AUTHOR",
      bio: "Tech reporter focused on how innovation reshapes sport and society.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
    }),
  ]);

  const readers = await Promise.all([
    createUserWithCredentials({
      name: "Taylor Brooks",
      email: "reader@pulse.app",
      role: "READER",
      bio: "Avid reader and weekend runner.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor",
    }),
    createUserWithCredentials({
      name: "Riley Park",
      email: "riley@pulse.app",
      role: "READER",
      verified: false,
      bio: "Pulse community member since day one.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=riley",
    }),
  ]);

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Sports",
        slug: "sports",
        description: "Game-day analysis, athlete profiles, and the business of sport.",
        color: "#0f766e",
        icon: "Trophy",
      },
    }),
    prisma.category.create({
      data: {
        name: "Culture",
        slug: "culture",
        description: "Music, film, fashion, and the ideas shaping culture.",
        color: "#7c3aed",
        icon: "Palette",
      },
    }),
    prisma.category.create({
      data: {
        name: "Technology",
        slug: "technology",
        description: "Innovation, startups, and the future of digital life.",
        color: "#2563eb",
        icon: "Cpu",
      },
    }),
    prisma.category.create({
      data: {
        name: "Opinion",
        slug: "opinion",
        description: "Perspectives and commentary from Pulse writers.",
        color: "#dc2626",
        icon: "MessageSquare",
      },
    }),
  ]);

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Football", slug: "football" } }),
    prisma.tag.create({ data: { name: "NBA", slug: "nba" } }),
    prisma.tag.create({ data: { name: "World Cup", slug: "world-cup" } }),
    prisma.tag.create({ data: { name: "Streaming", slug: "streaming" } }),
    prisma.tag.create({ data: { name: "AI", slug: "ai" } }),
    prisma.tag.create({ data: { name: "Fitness", slug: "fitness" } }),
    prisma.tag.create({ data: { name: "Documentary", slug: "documentary" } }),
    prisma.tag.create({ data: { name: "Startups", slug: "startups" } }),
  ]);

  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  const postsData = [
    {
      title: "Why This World Cup Changed Everything We Know About Pressing",
      slug: "world-cup-pressing-revolution",
      subtitle: "High lines and aggressive recovery runs aren't just tactics anymore—they're the new baseline.",
      authorId: authors[0].id,
      categoryId: categories[0].id,
      tagSlugs: ["world-cup", "football"],
      featured: true,
      pinned: true,
      viewsCount: 12450,
      likesCount: 892,
      commentsCount: 3,
      publishedAt: daysAgo(2),
      paragraphs: [
        "The 2026 World Cup didn't just crown a champion—it rewrote the tactical textbook. Teams that once sat deep and countered now press in coordinated waves, forcing mistakes higher up the pitch than ever before.",
        "What surprised analysts most wasn't the intensity but the sustainability. Squads rotated pressing triggers by half, keeping energy levels high deep into extra time.",
        "For coaches at every level, the lesson is clear: pressing isn't a phase anymore. It's a identity.",
      ],
    },
    {
      title: "The Quiet Rise of Women's Basketball Media",
      slug: "womens-basketball-media-rise",
      subtitle: "Independent creators are filling the coverage gap—and building loyal audiences faster than legacy outlets.",
      authorId: authors[0].id,
      categoryId: categories[0].id,
      tagSlugs: ["nba", "streaming"],
      featured: true,
      viewsCount: 8320,
      likesCount: 654,
      commentsCount: 2,
      publishedAt: daysAgo(5),
      paragraphs: [
        "When major networks cut back on WNBA studio shows, creators stepped in with film breakdowns, player interviews, and community watch parties.",
        "The result is a fragmented but vibrant media ecosystem where fans discover talent through TikTok clips and long-form YouTube analysis alike.",
      ],
    },
    {
      title: "How Documentaries Became Sport's Best Storytelling Format",
      slug: "documentaries-sport-storytelling",
      subtitle: "From locker rooms to living rooms, the doc boom is changing how we remember athletes.",
      authorId: authors[1].id,
      categoryId: categories[1].id,
      tagSlugs: ["documentary", "streaming"],
      viewsCount: 5670,
      likesCount: 421,
      commentsCount: 1,
      publishedAt: daysAgo(7),
      paragraphs: [
        "Sports documentaries used to be victory laps. Now they're character studies—messy, human, and willing to sit with contradiction.",
        "Streaming platforms bet big on access, and athletes bet bigger on control of their own narratives.",
      ],
    },
    {
      title: "Wearables Are Redefining Amateur Training",
      slug: "wearables-amateur-training",
      subtitle: "Pros have had data teams for years. Now your watch knows when to push and when to rest.",
      authorId: authors[2].id,
      categoryId: categories[2].id,
      tagSlugs: ["fitness", "ai"],
      viewsCount: 9100,
      likesCount: 712,
      commentsCount: 2,
      publishedAt: daysAgo(3),
      paragraphs: [
        "Recovery scores, HRV trends, and sleep debt metrics have moved from elite labs to consumer wrists.",
        "The next frontier isn't collecting data—it's translating it into decisions amateurs can actually follow.",
      ],
    },
    {
      title: "The Startup Trying to Fix Youth Sports Economics",
      slug: "startup-youth-sports-economics",
      subtitle: "Travel teams, facility fees, and equipment costs are pricing out families. One platform wants to change the math.",
      authorId: authors[2].id,
      categoryId: categories[2].id,
      tagSlugs: ["startups", "football"],
      viewsCount: 4320,
      likesCount: 298,
      commentsCount: 1,
      publishedAt: daysAgo(10),
      paragraphs: [
        "Youth sports in America is a $30B industry built on aspiration—and increasingly, exclusion.",
        "Pulse spoke with founders building sliding-scale leagues and shared equipment pools in underserved communities.",
      ],
    },
    {
      title: "What We Lose When Every Game Is Optimized",
      slug: "optimized-sports-opinion",
      subtitle: "Analytics made sport smarter. It also made it harder to surprise us.",
      authorId: authors[1].id,
      categoryId: categories[3].id,
      tagSlugs: ["football", "nba"],
      viewsCount: 6780,
      likesCount: 534,
      commentsCount: 2,
      publishedAt: daysAgo(14),
      paragraphs: [
        "Expected goals, win probability, and usage rates give us language for what we always felt but couldn't prove.",
        "But there's a cost to certainty: the joy of the inexplicable play, the upset that makes no sense on paper.",
      ],
    },
    {
      title: "Draft Day: Inside the Room Where Futures Get Priced",
      slug: "draft-day-inside-the-room",
      subtitle: "A rare look at the hours before a franchise commits millions to potential.",
      authorId: authors[0].id,
      categoryId: categories[0].id,
      tagSlugs: ["nba", "football"],
      status: "DRAFT" as const,
      viewsCount: 0,
      likesCount: 0,
      commentsCount: 0,
      publishedAt: null,
      paragraphs: [
        "Draft rooms are part war room, part therapy session. This is a work-in-progress look at how decisions actually get made.",
      ],
    },
  ];

  const posts = [];
  for (const data of postsData) {
    const content = tipTapDoc(...data.paragraphs);
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        subtitle: data.subtitle,
        content,
        contentHtml: htmlFromParagraphs(...data.paragraphs),
        coverImage: `https://picsum.photos/seed/${data.slug}/1200/630`,
        status: data.status ?? "PUBLISHED",
        publishedAt: data.publishedAt,
        readingTime: Math.max(1, Math.ceil(data.paragraphs.join(" ").split(/\s+/).length / 200)),
        viewsCount: data.viewsCount,
        likesCount: data.likesCount,
        commentsCount: data.commentsCount,
        featured: data.featured ?? false,
        pinned: data.pinned ?? false,
        authorId: data.authorId,
        categoryId: data.categoryId,
        tags: {
          create: data.tagSlugs.map((slug) => ({
            tag: { connect: { slug } },
          })),
        },
      },
    });
    posts.push(post);
  }

  const [post1, post2, post3, post4] = posts;

  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: "This perfectly captures what I felt watching the semifinals. The pressing triggers were unreal.",
        postId: post1.id,
        authorId: readers[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Great analysis. Would love to see a follow-up on how clubs are adapting at the academy level.",
        postId: post1.id,
        authorId: readers[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Totally agree—creators are doing the work legacy media won't.",
        postId: post2.id,
        authorId: readers[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "The access issue is real. My daughter's club fees went up 40% in two years.",
        postId: post4.id,
        authorId: readers[0].id,
      },
    }),
  ]);

  await prisma.comment.create({
    data: {
      content: "Academy coaches in Germany have been teaching this for years. Good to see it go mainstream.",
      postId: post1.id,
      authorId: authors[0].id,
      parentId: comments[0].id,
    },
  });

  await Promise.all([
    prisma.follow.create({ data: { followerId: readers[0].id, followingId: authors[0].id } }),
    prisma.follow.create({ data: { followerId: readers[0].id, followingId: authors[2].id } }),
    prisma.follow.create({ data: { followerId: readers[1].id, followingId: authors[0].id } }),
    prisma.follow.create({ data: { followerId: readers[1].id, followingId: authors[1].id } }),
    prisma.follow.create({ data: { followerId: editor.id, followingId: authors[0].id } }),
  ]);

  await Promise.all([
    prisma.like.create({ data: { userId: readers[0].id, postId: post1.id } }),
    prisma.like.create({ data: { userId: readers[1].id, postId: post1.id } }),
    prisma.like.create({ data: { userId: editor.id, postId: post1.id } }),
    prisma.like.create({ data: { userId: readers[0].id, postId: post2.id } }),
    prisma.like.create({ data: { userId: readers[0].id, commentId: comments[0].id } }),
  ]);

  await Promise.all([
    prisma.bookmark.create({ data: { userId: readers[0].id, postId: post1.id } }),
    prisma.bookmark.create({ data: { userId: readers[0].id, postId: post3.id } }),
    prisma.bookmark.create({ data: { userId: readers[1].id, postId: post2.id } }),
  ]);

  const collection = await prisma.bookmarkCollection.create({
    data: {
      name: "Must Reads",
      description: "My favorite Pulse stories this month.",
      isPublic: true,
      userId: readers[0].id,
      items: {
        create: [{ postId: post1.id }, { postId: post3.id }],
      },
    },
  });

  await Promise.all([
    prisma.view.createMany({
      data: Array.from({ length: 20 }, (_, i) => ({
        postId: post1.id,
        userId: i % 2 === 0 ? readers[0].id : undefined,
        createdAt: daysAgo(i),
      })),
    }),
    prisma.view.createMany({
      data: Array.from({ length: 10 }, (_, i) => ({
        postId: post2.id,
        createdAt: daysAgo(i + 1),
      })),
    }),
  ]);

  await Promise.all([
    prisma.notification.create({
      data: {
        userId: authors[0].id,
        actorId: readers[0].id,
        type: "LIKE",
        title: "New like",
        message: "Taylor Brooks liked your story",
        link: `/posts/${post1.slug}`,
        postId: post1.id,
      },
    }),
    prisma.notification.create({
      data: {
        userId: authors[0].id,
        actorId: readers[0].id,
        type: "COMMENT",
        title: "New comment",
        message: "Taylor Brooks commented on your story",
        link: `/posts/${post1.slug}`,
        postId: post1.id,
        commentId: comments[0].id,
      },
    }),
    prisma.notification.create({
      data: {
        userId: authors[0].id,
        actorId: readers[0].id,
        type: "FOLLOW",
        title: "New follower",
        message: "Taylor Brooks started following you",
        link: `/authors/${readers[0].id}`,
      },
    }),
  ]);

  await Promise.all([
    prisma.newsletterSubscriber.create({
      data: {
        email: "subscriber@example.com",
        confirmed: true,
        subscribedAt: daysAgo(30),
      },
    }),
    prisma.newsletterSubscriber.create({
      data: {
        email: "pending@example.com",
        confirmed: false,
        confirmToken: nanoid(32),
      },
    }),
    prisma.newsletterSubscriber.create({
      data: {
        email: "unsubscribed@example.com",
        confirmed: false,
        unsubscribedAt: daysAgo(5),
      },
    }),
  ]);

  await Promise.all([
    prisma.advertisement.create({
      data: {
        title: "Pulse Premium",
        linkUrl: "https://pulse.app/premium",
        placement: "SIDEBAR",
        active: true,
        priority: 10,
        imageUrl: "https://picsum.photos/seed/ad-sidebar/300/250",
      },
    }),
    prisma.advertisement.create({
      data: {
        title: "Sports Analytics Summit",
        linkUrl: "https://example.com/summit",
        placement: "IN_FEED",
        active: true,
        priority: 5,
      },
    }),
  ]);

  await prisma.report.create({
    data: {
      reporterId: readers[1].id,
      reason: "SPAM",
      description: "Suspicious promotional link in a comment thread.",
      status: "PENDING",
      commentId: comments[2].id,
    },
  });

  console.log("✅ Seed complete");
  console.log("\nDemo accounts (password: Password123!):");
  console.log("  admin@pulse.app      — Administrator");
  console.log("  editor@pulse.app     — Editor");
  console.log("  maya@pulse.app       — Author");
  console.log("  marcus@pulse.app     — Author");
  console.log("  sam@pulse.app        — Author");
  console.log("  reader@pulse.app     — Reader");
  console.log(`\nCreated ${posts.length} posts, ${comments.length} comments, collection "${collection.name}"`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
