"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteArticle,
  duplicateArticle,
  toggleArticleStatus,
} from "@/lib/actions/articles";
import type { ArticleListItem } from "@/lib/types";
import { formatDateIST } from "@/lib/timezone";

export function NewsTable({ articles }: { articles: ArticleListItem[] }) {
  async function onDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    const res = await deleteArticle(id);
    if (!res.success) toast.error(res.message);
    else toast.success("Deleted");
    window.location.reload();
  }

  async function onDuplicate(id: string) {
    const res = await duplicateArticle(id);
    if (!res.success) toast.error(res.message);
    else toast.success("Duplicated");
    window.location.reload();
  }

  async function onToggle(id: string) {
    const res = await toggleArticleStatus(id);
    if (!res.success) toast.error(res.message);
    else toast.success("Updated");
    window.location.reload();
  }

  if (!articles.length) {
    return <p className="text-muted-foreground">No articles yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Article</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Flags</TableHead>
          <TableHead>Published</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                {article.featuredImage && (
                  <div className="relative h-10 w-14 overflow-hidden rounded">
                    <Image src={article.featuredImage} alt="" fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-medium line-clamp-1">{article.title}</p>
                  <p className="text-xs text-muted-foreground">{article.slug}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{article.category.name}</TableCell>
            <TableCell>
              <Badge variant={article.status === "published" ? "default" : "secondary"}>
                {article.status}
              </Badge>
            </TableCell>
            <TableCell className="space-x-1">
              {article.featured && <Badge variant="outline">Featured</Badge>}
              {article.breaking && <Badge className="bg-[#DC2626]">Breaking</Badge>}
              {article.trending && <Badge variant="outline">Trending</Badge>}
              {article.editorsPick && <Badge variant="outline">Editor&apos;s pick</Badge>}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {article.publishedAt
                ? formatDateIST(article.publishedAt, { dateStyle: "medium" })
                : "—"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Link
                  href={`/admin/news/${article._id}/edit`}
                  className="inline-flex h-7 items-center rounded-lg px-2 text-sm hover:bg-muted"
                >
                  Edit
                </Link>
                <Link
                  href={`/news/${article.slug}`}
                  target="_blank"
                  className="inline-flex h-7 items-center rounded-lg px-2 text-sm hover:bg-muted"
                >
                  View
                </Link>
                <Button variant="ghost" size="sm" onClick={() => onToggle(article._id)}>
                  {article.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDuplicate(article._id)}>
                  Copy
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(article._id)}>
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
