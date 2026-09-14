"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/db/connect";
import { Banner } from "@/lib/models/Banner";
import { bannerSchema } from "@/lib/validation/schemas";
import type { ActionResult } from "@/lib/actions/articles";

export async function saveBanner(data: unknown, id?: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = bannerSchema.parse(data);
    await connectDB();

    const payload = {
      ...parsed,
      startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
      endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
    };

    if (id) {
      await Banner.findByIdAndUpdate(id, payload);
    } else {
      await Banner.create(payload);
    }

    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to save banner",
    };
  }
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    await Banner.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to delete" };
  }
}
