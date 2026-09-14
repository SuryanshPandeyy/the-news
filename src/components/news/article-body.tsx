import { sanitizeArticleContent } from "@/lib/sanitize";

export function ArticleBody({ html }: { html: string }) {
  const safe = sanitizeArticleContent(html);
  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-[#2563EB]"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
