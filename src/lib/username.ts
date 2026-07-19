import { slugify } from "@/lib/slug";

export function nameToUsername(name: string): string {
  return slugify(name);
}

export function authorProfileUrl(user: { id: string; name: string }): string {
  return `/authors/${nameToUsername(user.name)}`;
}
