import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n/messages";

export const LOCALE_COOKIE = "locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value === "hi" || value === "en") return value;

  try {
    const { getSettings } = await import("@/lib/models/Settings");
    const settings = await getSettings();
    if (settings.defaultLocale === "en") return "en";
  } catch {
    /* ignore */
  }
  return "hi";
}
