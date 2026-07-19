import DOMPurify from "isomorphic-dompurify";

type SanitizeConfig = Parameters<typeof DOMPurify.sanitize>[1];

const DEFAULT_CONFIG: SanitizeConfig = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "img",
    "figure",
    "figcaption",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "hr",
    "span",
    "div",
    "iframe",
  ],
  ALLOWED_ATTR: [
    "href",
    "target",
    "rel",
    "src",
    "alt",
    "title",
    "class",
    "width",
    "height",
    "colspan",
    "rowspan",
    "data-type",
    "data-id",
    "allow",
    "allowfullscreen",
    "frameborder",
  ],
  ALLOW_DATA_ATTR: true,
  ADD_ATTR: ["target"],
  FORBID_TAGS: ["script", "style", "form", "input", "object", "embed"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
};

export function sanitizeHtml(
  dirty: string,
  config: SanitizeConfig = DEFAULT_CONFIG,
): string {
  return String(DOMPurify.sanitize(dirty, config));
}

export function sanitizePlainText(text: string): string {
  return String(
    DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
  );
}

export function stripHtml(html: string): string {
  return sanitizePlainText(html).trim();
}

export { DEFAULT_CONFIG as SANITIZE_CONFIG };
