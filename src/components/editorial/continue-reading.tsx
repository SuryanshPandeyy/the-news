import Link from "next/link";

export function ContinueReading({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="text-[13px] font-bold text-[#0000ee] underline-offset-2 hover:underline decoration-1"
    >
      Continue Reading
    </Link>
  );
}
