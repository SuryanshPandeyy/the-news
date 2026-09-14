import Link from "next/link";
import { cn } from "@/lib/utils";

export function PaginationControls({
  page,
  totalPages,
  basePath,
  query = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function href(p: number) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <nav className="flex items-center justify-center gap-2 py-8" aria-label="Pagination">
      <PageLink href={href(page - 1)} disabled={page <= 1}>Previous</PageLink>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <PageLink href={href(page + 1)} disabled={page >= totalPages}>Next</PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-md border px-3 py-1.5 text-sm text-muted-foreground opacity-50">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
      )}
    >
      {children}
    </Link>
  );
}
