"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSettings } from "@/lib/actions/settings";

type SettingsData = {
  siteName: string;
  siteDescription?: string;
  logo?: string;
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

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof SettingsData>(key: K, value: SettingsData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await saveSettings(form);
    setLoading(false);
    if (!res.success) toast.error(res.message);
    else toast.success("Settings saved");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4">
      <div className="space-y-1">
        <Label>Site name</Label>
        <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Description</Label>
        <Textarea
          value={form.siteDescription ?? ""}
          onChange={(e) => set("siteDescription", e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>Contact email</Label>
        <Input
          value={form.contactEmail ?? ""}
          onChange={(e) => set("contactEmail", e.target.value)}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label>Facebook URL</Label>
          <Input value={form.socialFacebook ?? ""} onChange={(e) => set("socialFacebook", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>X / Twitter URL</Label>
          <Input value={form.socialTwitter ?? ""} onChange={(e) => set("socialTwitter", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Instagram URL</Label>
          <Input value={form.socialInstagram ?? ""} onChange={(e) => set("socialInstagram", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>LinkedIn URL</Label>
          <Input value={form.socialLinkedin ?? ""} onChange={(e) => set("socialLinkedin", e.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Footer text</Label>
        <Textarea value={form.footerText ?? ""} onChange={(e) => set("footerText", e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Default SEO title</Label>
        <Input value={form.defaultSeoTitle ?? ""} onChange={(e) => set("defaultSeoTitle", e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Default SEO description</Label>
        <Textarea
          value={form.defaultSeoDescription ?? ""}
          onChange={(e) => set("defaultSeoDescription", e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save settings"}</Button>
    </form>
  );
}
