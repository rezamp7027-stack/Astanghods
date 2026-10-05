"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ProfileFormProps = {
  userId: string;
  initial: {
    displayName: string;
    fullName: string;
    phone: string;
    city: string;
    bio: string;
    onboardingCompleted: boolean;
  };
};

export function ProfileForm({ userId, initial }: ProfileFormProps) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: form.displayName.trim() || null,
        full_name: form.fullName.trim() || null,
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        bio: form.bio.trim() || null,
        onboarding_completed: true,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      setMessage("ذخیره پروفایل انجام نشد. لطفاً دوباره تلاش کنید.");
      return;
    }

    setForm((current) => ({ ...current, onboardingCompleted: true }));
    setMessage("پروفایل با موفقیت ذخیره شد.");
  }

  return (
    <form onSubmit={submit} className="form-stack">
      <label className="form-label" htmlFor="displayName">
        نام نمایشی
        <input className="input" id="displayName" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} autoComplete="nickname" />
      </label>
      <label className="form-label" htmlFor="fullName">
        نام و نام خانوادگی
        <input className="input" id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} autoComplete="name" />
      </label>
      <label className="form-label" htmlFor="phone">
        شماره تماس
        <input className="input" id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" autoComplete="tel" dir="ltr" />
      </label>
      <label className="form-label" htmlFor="city">
        شهر
        <input className="input" id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} autoComplete="address-level2" />
      </label>
      <label className="form-label" htmlFor="bio">
        معرفی کوتاه
        <textarea className="input" id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={5} />
      </label>
      {message && <div className="notice">{message}</div>}
      <button className="btn btn-primary" type="submit" disabled={saving}>
        {saving ? "در حال ذخیره…" : "ذخیره پروفایل"}
      </button>
    </form>
  );
}
