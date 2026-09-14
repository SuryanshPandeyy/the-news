import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The story you&apos;re looking for isn&apos;t here.</p>
      <Link href="/" className="mt-6 text-[#2563EB] hover:underline">Back to homepage</Link>
    </div>
  );
}
