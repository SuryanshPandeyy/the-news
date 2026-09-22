import Link from "next/link";

export function NewsSectionHeader({
  title,
  action,
  actionHref,
}: {
  title: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="h-7 w-1.5 shrink-0 bg-[#e71920]" />
        <h2 className="whitespace-nowrap text-2xl font-black text-gray-900">{title}</h2>
        <div className="hidden h-px flex-1 bg-gray-300 sm:block" />
      </div>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="shrink-0 text-sm font-semibold text-[#e71920] hover:underline"
        >
          {action}
        </Link>
      )}
    </div>
  );
}
