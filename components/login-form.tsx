"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    setLoading(false);
    if (authError) {
      setError("ارسال لینک ورود انجام نشد. تنظیمات Auth و ایمیل Supabase را بررسی کنید.");
      return;
    }
    setSent(true);
  };

  if (sent) {
    return <div className="notice">لینک ورود ارسال شد. صندوق ایمیل را بررسی کنید.</div>;
  }

  return (
    <form onSubmit={submit} className="form-stack">
      <label className="form-label" htmlFor="email">
        ایمیل
        <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" dir="ltr" />
      </label>
      {error && <div className="notice error">{error}</div>}
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? "در حال ارسال…" : "ارسال لینک ورود"}
      </button>
    </form>
  );
}
