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
import { useLocale } from "@/components/providers/locale-provider";
import type { ArticleListItem } from "@/lib/types";
import { formatDateIST } from "@/lib/timezone";

export function NewsTable({ articles }: { articles: ArticleListItem[] }) {
  const { t } = useLocale();
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
          <TableHead>{t("title")}</TableHead>
          <TableHead>{t("categories")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>Flags</TableHead>
          <TableHead>{t("publishedAt")}</TableHead>
          <TableHead className="text-right">{t("viewCount")}</TableHead>
          <TableHead className="text-right">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                {article.featuredImage && (
                  <div className="relative h-10 w-14 overflow-hidden rounded">
                    <Image
                      src={article.featuredImage}
                      alt={article.featuredImageAlt || article.title}
                      fill
                      className="object-cover"
                    />
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
              {article.featured && <Badge variant="outline">{t("featuredHero")}</Badge>}
              {article.breaking && <Badge className="bg-[#DC2626]">{t("breaking")}</Badge>}
              {article.trending && <Badge variant="outline">{t("trending")}</Badge>}
              {article.editorsPick && <Badge variant="outline">{t("editorsPick")}</Badge>}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {article.publishedAt
                ? formatDateIST(article.publishedAt, { dateStyle: "medium" })
                : "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground">
              {article.views ?? 0}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Link
                  href={`/admin/news/${article._id}/edit`}
                  className="inline-flex h-7 items-center rounded-lg px-2 text-sm hover:bg-muted"
                >
                  {t("edit")}
                </Link>
                <Link
                  href={`/news/${article.slug}`}
                  target="_blank"
                  className="inline-flex h-7 items-center rounded-lg px-2 text-sm hover:bg-muted"
                >
                  {t("view")}
                </Link>
                <Button variant="ghost" size="sm" onClick={() => onToggle(article._id)}>
                  {article.status === "published" ? t("unpublish") : t("publish")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDuplicate(article._id)}>
                  {t("copy")}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(article._id)}>
                  {t("delete")}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
