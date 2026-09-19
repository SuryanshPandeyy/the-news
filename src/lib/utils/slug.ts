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

/** Slug for articles: from optional manual input, else title; never empty. */
export function slugFromTitle(title: string, manualSlug?: string): string {
  const manual = manualSlug?.trim();
  if (manual) {
    let slug = normalizeManualSlug(manual);
    if (!slug) slug = slugify(title);
    if (!slug) slug = `story-${Date.now()}`;
    return slug;
  }
  let slug = slugify(title);
  if (!slug) slug = `story-${Date.now()}`;
  return slug;
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
