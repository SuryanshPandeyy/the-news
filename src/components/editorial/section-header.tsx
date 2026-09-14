import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeader({
  title,
  href,
  links = [],
}: {
  title: string;
  href?: string;
  links?: { label: string; href: string; active?: boolean }[];
}) {
  const Title = (
    <h2 className="flex cursor-pointer items-center text-[22px] font-bold leading-none text-black">
      {title}
      <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200">
        <ChevronRight className="h-3 w-3 text-gray-600" strokeWidth={3} />
      </span>
    </h2>
  );

  return (
    <div className="mb-5 flex items-center justify-between border-b-2 border-black pb-2">
      {href ? (
        <Link href={href} className="group">
          {Title}
        </Link>
      ) : (
        <div className="group">{Title}</div>
      )}
      {links.length > 0 && (
        <div className="mb-1 hidden space-x-4 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-bold ${
                link.active
                  ? "-mb-[9px] border-b-2 border-black pb-[7px] text-black"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
