"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CourseEnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function enroll() {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    setIsError(false);

    const supabase = createClient();
    const { data: claims } = await supabase.auth.getClaims();
    if (!claims?.claims?.sub) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      setLoading(false);
      return;
    }

    const { error } = await supabase.rpc("enroll_in_course", { p_course_id: courseId });
    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage(error.message.includes("course_not_available")
        ? "این دوره دیگر برای ثبت‌نام در دسترس نیست."
        : "ثبت‌نام در دوره انجام نشد. لطفاً دوباره تلاش کنید.");
      return;
    }

    setMessage("دوره به مسیر یادگیری شما اضافه شد.");
    router.refresh();
  }

  return (
    <div className="form-stack">
      <button className="btn btn-primary" type="button" disabled={loading} onClick={enroll}>
        {loading ? "در حال ثبت‌نام…" : "شروع دوره"}
      </button>
      {message && <div className={isError ? "notice error" : "notice"} role="status" aria-live="polite">{message}</div>}
    </div>
  );
}
