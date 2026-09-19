"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Bold black field titles for Hindi-first admin readability */
export function AdminLabel({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <Label htmlFor={htmlFor} className={cn("font-bold text-black", className)}>
      {children}
    </Label>
  );
}
