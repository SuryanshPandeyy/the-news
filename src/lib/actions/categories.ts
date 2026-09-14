"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/db/connect";
import { Article } from "@/lib/models/Article";
import { Category } from "@/lib/models/Category";
import { categorySchema } from "@/lib/validation/schemas";
import type { ActionResult } from "@/lib/actions/articles";

export async function saveCategory(data: unknown, id?: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = categorySchema.parse(data);
    await connectDB();

    if (id) {
      await Category.findByIdAndUpdate(id, parsed);
    } else {
      const exists = await Category.findOne({ slug: parsed.slug });
      if (exists) return { success: false, message: "Slug exists" };
      await Category.create(parsed);
    }

    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true, message: "Category saved" };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to save category",
    };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    const count = await Article.countDocuments({ category: id });
    if (count > 0) {
      return { success: false, message: "Category has articles" };
    }
    await Category.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to delete" };
  }
}
