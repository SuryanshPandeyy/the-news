import type { MessageKey } from "@/lib/i18n/messages";

export type DefaultSectionLink = {
  id: string;
  href: string;
  labelKey: MessageKey;
};

/** Shown in header/sidebar when no admin categories exist. */
export const DEFAULT_SECTION_LINKS: DefaultSectionLink[] = [
  { id: "today", href: "/today", labelKey: "todaysNews" },
  { id: "trending", href: "/trending", labelKey: "trending" },
  { id: "breaking", href: "/breaking", labelKey: "breaking" },
];
