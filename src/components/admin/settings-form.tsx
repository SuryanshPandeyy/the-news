"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLabel } from "@/components/admin/admin-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { saveSettings } from "@/lib/actions/settings";
import type { Locale } from "@/lib/i18n/messages";

type SettingsData = {
  siteName: string;
  siteDescription?: string;
  logo?: string;
  favicon?: string;
  defaultAuthor?: string;
  defaultLocale?: Locale;
  contactEmail?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialYoutube?: string;
  socialWhatsapp?: string;
  footerText?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultSeoImage?: string;
  newsletterFromName?: string;
};

async function uploadFile(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) {
    toast.error(data.error ?? "Upload failed");
    return null;
  }
  return data.url as string;
}

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const [form, setForm] = useState({
    ...initial,
    defaultLocale: initial.defaultLocale ?? ("hi" as Locale),
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { t } = useLocale();
  const router = useRouter();

  function set<K extends keyof SettingsData>(key: K, value: SettingsData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await saveSettings(form);
    setLoading(false);
    if (!res.success) toast.error(res.message);
    else {
      toast.success(t("settingsSaved"));
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="font-bold text-black">{t("language")}</h2>
        <LanguageSwitcher />
        <div className="space-y-1 pt-2">
          <AdminLabel htmlFor="defaultLocale">{t("defaultLocale")}</AdminLabel>
          <select
            id="defaultLocale"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={form.defaultLocale ?? "hi"}
            onChange={(e) => set("defaultLocale", e.target.value as Locale)}
          >
            <option value="hi">{t("hindi")}</option>
            <option value="en">{t("english")}</option>
          </select>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="font-bold text-black">{t("siteIdentity")}</h2>
        <div className="space-y-1">
          <AdminLabel>{t("siteName")}</AdminLabel>
          <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
        </div>
        <div className="space-y-1">
          <AdminLabel>{t("description")}</AdminLabel>
          <Textarea
            value={form.siteDescription ?? ""}
            onChange={(e) => set("siteDescription", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <AdminLabel>{t("logo")}</AdminLabel>
          <Input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              const url = await uploadFile(file);
              setUploading(false);
              if (url) {
                set("logo", url);
                toast.success("OK");
              }
              e.target.value = "";
            }}
          />
          {form.logo && (
            <img src={form.logo} alt="" className="max-h-16 object-contain" />
          )}
        </div>
        <div className="space-y-2">
          <AdminLabel>{t("favicon")}</AdminLabel>
          <Input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              const url = await uploadFile(file);
              setUploading(false);
              if (url) set("favicon", url);
              e.target.value = "";
            }}
          />
          {(form.favicon || form.logo) && (
            <img
              src={form.favicon || form.logo}
              alt=""
              className="h-8 w-8 object-contain"
            />
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="font-bold text-black">{t("editorialDefaults")}</h2>
        <div className="space-y-1">
          <AdminLabel>{t("defaultAuthor")}</AdminLabel>
          <Input
            value={form.defaultAuthor ?? ""}
            onChange={(e) => set("defaultAuthor", e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="font-bold text-black">{t("contactSocial")}</h2>
        <div className="space-y-1">
          <AdminLabel>Contact email</AdminLabel>
          <Input
            value={form.contactEmail ?? ""}
            onChange={(e) => set("contactEmail", e.target.value)}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <AdminLabel>Facebook URL</AdminLabel>
            <Input value={form.socialFacebook ?? ""} onChange={(e) => set("socialFacebook", e.target.value)} />
          </div>
          <div className="space-y-1">
            <AdminLabel>X / Twitter URL</AdminLabel>
            <Input value={form.socialTwitter ?? ""} onChange={(e) => set("socialTwitter", e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <AdminLabel>Footer text</AdminLabel>
          <Textarea value={form.footerText ?? ""} onChange={(e) => set("footerText", e.target.value)} />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="font-bold text-black">{t("defaultSeo")}</h2>
        <div className="space-y-1">
          <AdminLabel>Default SEO title</AdminLabel>
          <Input value={form.defaultSeoTitle ?? ""} onChange={(e) => set("defaultSeoTitle", e.target.value)} />
        </div>
        <div className="space-y-1">
          <AdminLabel>Default SEO description</AdminLabel>
          <Textarea
            value={form.defaultSeoDescription ?? ""}
            onChange={(e) => set("defaultSeoDescription", e.target.value)}
          />
        </div>
      </section>

      <Button type="submit" disabled={loading || uploading}>
        {loading ? t("saving") : t("saveSettings")}
      </Button>
    </form>
  );
}
