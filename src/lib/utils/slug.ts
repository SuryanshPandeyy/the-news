/** Decode URL segment and normalize Unicode for consistent DB lookup. */
export function normalizeSlug(raw: string): string {
  let value = raw.trim();
  if (value.includes("%")) {
    try {
      value = decodeURIComponent(value);
    } catch {
      // keep raw value
    }
  }
  return value.normalize("NFKC").trim();
}

/** URL slug from title: spaces → dashes; keeps letters/numbers from any language. */
export function slugify(text: string): string {
  return normalizeSlug(text)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Manual slug: preserve Devanagari (and other scripts); only fix spaces and unsafe URL chars. */
export function normalizeManualSlug(text: string): string {
  return normalizeSlug(text)
    .replace(/\s+/g, "-")
    .replace(/[#?%/\\]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** English-style URL slug (a-z, 0-9, dashes). */
export function isLatinUrlSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

export function isObjectIdSlug(slug: string): boolean {
  return /^[a-f0-9]{24}$/i.test(slug);
}

/**
 * Latin slug from title or manual English slug.
 * Returns null for Hindi / non-Latin titles → caller should use document `_id` as slug.
 */
export function latinSlugFromTitle(title: string, manualSlug?: string): string | null {
  const manual = manualSlug?.trim();
  if (manual) {
    const normalized = normalizeManualSlug(manual);
    if (normalized && isLatinUrlSlug(normalized)) return normalized;
    if (normalized) return null;
  }
  const fromTitle = slugify(title);
  if (fromTitle && isLatinUrlSlug(fromTitle)) return fromTitle;
  return null;
}

/** Slug for articles: from optional manual input, else title; never empty. */
export function slugFromTitle(title: string, manualSlug?: string): string {
  const latin = latinSlugFromTitle(title, manualSlug);
  if (latin) return latin;
  const manual = manualSlug?.trim();
  if (manual) {
    const normalized = normalizeManualSlug(manual);
    if (normalized) return normalized;
  }
  const fromTitle = slugify(title);
  if (fromTitle) return fromTitle;
  return `story-${Date.now()}`;
}

/** Try several normalized forms when resolving /news/[slug] from the URL. */
export function slugLookupCandidates(raw: string): string[] {
  const out: string[] = [];
  const add = (s: string) => {
    const t = s.trim();
    if (t && !out.includes(t)) out.push(t);
  };

  add(raw);
  const normalized = normalizeSlug(raw);
  add(normalized);
  add(normalizeManualSlug(normalized));
  add(slugify(normalized));

  return out;
}

export function newsArticlePath(slug: string): string {
  return `/news/${encodeURIComponent(normalizeSlug(slug))}`;
}

export function categoryPath(slug: string): string {
  return `/category/${encodeURIComponent(normalizeSlug(slug))}`;
}
