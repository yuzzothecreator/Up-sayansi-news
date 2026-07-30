import { Resend } from "resend";
import { siteConfig } from "@/config/site";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function getFromEmail(): string {
  return (
    process.env.EMAIL_FROM ??
    process.env.RESEND_FROM_EMAIL ??
    `${siteConfig.name} <hello@pulse.app>`
  );
}

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
};

export type SendEmailResult = {
  id: string;
  success: boolean;
};

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: getFromEmail(),
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
    tags: options.tags,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return {
    id: data?.id ?? "",
    success: true,
  };
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: `Welcome to ${siteConfig.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1>Welcome, ${name}!</h1>
        <p>Thanks for joining ${siteConfig.name}. Start exploring stories or write your first post.</p>
        <a href="${siteConfig.url}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">
          Explore UpSayansi News
        </a>
      </div>
    `,
    text: `Welcome, ${name}! Thanks for joining ${siteConfig.name}. Visit ${siteConfig.url} to get started.`,
    tags: [{ name: "category", value: "welcome" }],
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${siteConfig.url}/verify-email?token=${token}`;

  return sendEmail({
    to,
    subject: `Verify your ${siteConfig.name} email`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1>Verify your email</h1>
        <p>Click the button below to verify your email address.</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
    text: `Verify your email: ${verifyUrl}`,
    tags: [{ name: "category", value: "verification" }],
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${siteConfig.url}/reset-password?token=${token}`;

  return sendEmail({
    to,
    subject: `Reset your ${siteConfig.name} password`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1>Reset your password</h1>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
    text: `Reset your password: ${resetUrl}`,
    tags: [{ name: "category", value: "password-reset" }],
  });
}

export async function sendNewsletterConfirmation(to: string, token: string) {
  const confirmUrl = `${siteConfig.url}/newsletter/confirm?token=${token}`;

  return sendEmail({
    to,
    subject: `Confirm your ${siteConfig.name} newsletter subscription`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1>Confirm your subscription</h1>
        <p>Click below to confirm your newsletter subscription.</p>
        <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">
          Confirm Subscription
        </a>
      </div>
    `,
    text: `Confirm your subscription: ${confirmUrl}`,
    tags: [{ name: "category", value: "newsletter" }],
  });
}

export async function sendPostPublishedNotification(
  to: string,
  postTitle: string,
  postUrl: string,
) {
  return sendEmail({
    to,
    subject: `New story: ${postTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1>${postTitle}</h1>
        <p>A new story from an author you follow is now live on ${siteConfig.name}.</p>
        <a href="${postUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">
          Read Story
        </a>
      </div>
    `,
    text: `New story: ${postTitle} — ${postUrl}`,
    tags: [{ name: "category", value: "notification" }],
  });
}
