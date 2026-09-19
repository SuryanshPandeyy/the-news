"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/db/connect";
import { Settings } from "@/lib/models/Settings";
import { settingsSchema } from "@/lib/validation/schemas";
import { setLocaleAction } from "@/lib/actions/locale";
import type { ActionResult } from "@/lib/actions/articles";
import type { Locale } from "@/lib/i18n/messages";

export async function saveSettings(data: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = settingsSchema.parse(data);
    await connectDB();
    await Settings.findOneAndUpdate({ key: "main" }, parsed, { upsert: true });
    if (parsed.defaultLocale) {
      await setLocaleAction(parsed.defaultLocale as Locale);
    }
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true, message: "Settings saved" };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to save settings",
    };
  }
}
