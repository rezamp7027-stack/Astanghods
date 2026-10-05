"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LessonProgress({ lessonId, initial }: { lessonId: string; initial: number }) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save(next: number) {
    setValue(next);
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.rpc("update_lesson_progress", {
      p_lesson_id: lessonId,
      p_progress_percent: next,
    });
    setSaving(false);
    setMessage(error ? "ذخیره پیشرفت انجام نشد." : next >= 100 ? "درس تکمیل شد." : "پیشرفت ذخیره شد.");
  }

  return (
    <div className="form-stack">
      <label className="form-label" htmlFor="lesson-progress">پیشرفت درس: {value}%</label>
      <input id="lesson-progress" type="range" min="0" max="100" step="5" value={value} onChange={(e) => save(Number(e.target.value))} disabled={saving} />
      {message && <div className="notice">{message}</div>}
    </div>
  );
}
