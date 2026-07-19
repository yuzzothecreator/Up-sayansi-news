import slugifyLib from "slugify";

const SLUG_OPTIONS = {
  lower: true,
  strict: true,
  trim: true,
} as const;

export function slugify(text: string, maxLength = 200): string {
  return slugifyLib(text, SLUG_OPTIONS).slice(0, maxLength);
}

export function slugifyUnique(text: string, suffix?: string | number): string {
  const base = slugify(text);
  if (suffix === undefined) return base;
  const suffixStr = String(suffix);
  const maxBaseLength = 200 - suffixStr.length - 1;
  return `${base.slice(0, maxBaseLength)}-${suffixStr}`;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 200;
}

export async function generateUniqueSlug(
  title: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(title);
  if (!(await exists(base))) return base;

  for (let i = 2; i <= 100; i++) {
    const candidate = slugifyUnique(title, i);
    if (!(await exists(candidate))) return candidate;
  }

  return slugifyUnique(title, Date.now());
}
