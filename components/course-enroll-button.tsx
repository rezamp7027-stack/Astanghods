"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CourseEnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function enroll() {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { data: claims } = await supabase.auth.getClaims();
    if (!claims?.claims) {
      window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const { error } = await supabase.rpc("enroll_in_course", { p_course_id: courseId });
    setLoading(false);
    setMessage(error ? "ثبت‌نام در دوره انجام نشد." : "دوره به مسیر یادگیری شما اضافه شد.");
  }

  return (
    <div className="form-stack">
      <button className="btn btn-primary" type="button" disabled={loading} onClick={enroll}>
        {loading ? "در حال ثبت‌نام…" : "شروع دوره"}
      </button>
      {message && <div className="notice">{message}</div>}
    </div>
  );
}
