import { nanoid } from "nanoid";
import prisma from "@/lib/prisma";
import { sendNewsletterConfirmation } from "@/lib/email";
import { ServiceError } from "@/lib/service-utils";

export async function subscribeNewsletter(email: string) {
  const normalized = email.trim().toLowerCase();
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: normalized },
  });

  if (existing?.confirmed && !existing.unsubscribedAt) {
    throw new ServiceError("Already subscribed", 409);
  }

  const confirmToken = nanoid(32);

  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email: normalized },
    create: {
      email: normalized,
      confirmToken,
      confirmed: false,
    },
    update: {
      confirmToken,
      confirmed: false,
      unsubscribedAt: null,
    },
  });

  try {
    await sendNewsletterConfirmation(normalized, confirmToken);
  } catch {
    // Email delivery is best-effort during development
  }

  return subscriber;
}

export async function verifyNewsletterSubscription(token: string) {
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { confirmToken: token },
  });

  if (!subscriber) {
    throw new ServiceError("Invalid confirmation token", 400);
  }

  return prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: {
      confirmed: true,
      confirmToken: null,
      unsubscribedAt: null,
    },
  });
}

export async function unsubscribeNewsletter(email: string) {
  const normalized = email.trim().toLowerCase();
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { email: normalized },
  });

  if (!subscriber) {
    throw new ServiceError("Subscriber not found", 404);
  }

  return prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: {
      confirmed: false,
      unsubscribedAt: new Date(),
      confirmToken: null,
    },
  });
}

export async function listSubscribers(page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  const where = { confirmed: true, unsubscribedAt: null };

  const [data, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { subscribedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.newsletterSubscriber.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getSubscriberCount() {
  return prisma.newsletterSubscriber.count({
    where: { confirmed: true, unsubscribedAt: null },
  });
}
