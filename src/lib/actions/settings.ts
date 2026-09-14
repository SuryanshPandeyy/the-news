"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/db/connect";
import { Settings } from "@/lib/models/Settings";
import { settingsSchema } from "@/lib/validation/schemas";
import type { ActionResult } from "@/lib/actions/articles";

export async function saveSettings(data: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = settingsSchema.parse(data);
    await connectDB();
    await Settings.findOneAndUpdate({ key: "main" }, parsed, { upsert: true });
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
