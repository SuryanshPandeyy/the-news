import { CategoriesManager } from "@/components/admin/categories-manager";
import { getAllCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories(true);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <CategoriesManager categories={categories} />
    </div>
  );
}
