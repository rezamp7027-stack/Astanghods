"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function messageForError(message: string) {
  if (message.includes("already_registered")) return "شما پیش‌تر برای این رویداد ثبت‌نام کرده‌اید.";
  if (message.includes("event_full")) return "ظرفیت رویداد تکمیل است.";
  if (message.includes("event_not_available")) return "ثبت‌نام این رویداد دیگر در دسترس نیست.";
  if (message.includes("authentication_required")) return "برای ثبت‌نام باید وارد حساب خود شوید.";
  return "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.";
}

export function EventRegistrationButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function register() {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    setIsError(false);

    const supabase = createClient();
    const { data: claimsData } = await supabase.auth.getClaims();

    if (!claimsData?.claims?.sub) {
      window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const { data, error } = await supabase.rpc("register_for_event", {
      p_event_id: eventId,
    });

    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage(messageForError(error.message));
      return;
    }

    const status = Array.isArray(data) ? data[0]?.status : data?.status;
    setMessage(
      status === "waitlisted"
        ? "ظرفیت تکمیل است و درخواست شما در صف انتظار قرار گرفت."
        : "ثبت‌نام شما با موفقیت انجام شد و رویداد به مسیر شما اضافه شد.",
    );
  }

  return (
    <div className="form-stack">
      <button className="btn btn-primary" onClick={register} disabled={loading} type="button">
        {loading ? "در حال ثبت‌نام…" : "ثبت‌نام در رویداد"}
      </button>
      {message && (
        <div className={isError ? "notice error" : "notice"} role="status" aria-live="polite">
          {message}
        </div>
      )}
    </div>
  );
}
