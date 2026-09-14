import { formatDateIST } from "@/lib/timezone";

export function CategoryBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[2px] border border-gray-300 px-[6px] py-[2px] text-[10px] font-bold uppercase tracking-wider text-black">
      {children}
    </span>
  );
}

export function ArticleDateLabel({ date }: { date: string }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
      {formatDateIST(date, { month: "long", day: "numeric", year: "numeric" })}
    </span>
  );
}
