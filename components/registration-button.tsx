"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function RegistrationButton({ programId }: { programId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const register = async () => {
    setLoading(true);
    setMessage(null);
    setError(false);

    const supabase = createClient();
    const { data: claimsData } = await supabase.auth.getClaims();

    if (!claimsData?.claims) {
      window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const { data, error: rpcError } = await supabase.rpc("register_for_program", {
      p_program_id: programId,
    });

    setLoading(false);

    if (rpcError) {
      setError(true);
      setMessage(
        rpcError.message.includes("already_registered")
          ? "شما پیش‌تر برای این برنامه ثبت‌نام کرده‌اید."
          : "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید."
      );
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (result?.registration_status === "waitlisted") {
      setMessage(`ظرفیت تکمیل است. شما در صف انتظار جایگاه ${result.waitlist_position} هستید.`);
    } else {
      setMessage("ثبت‌نام با موفقیت انجام شد و این برنامه به مسیر شما اضافه شد.");
    }
  };

  return (
    <div className="form-stack">
      <button className="btn btn-primary" onClick={register} disabled={loading} type="button">
        {loading ? "در حال ثبت‌نام…" : "ثبت‌نام در برنامه"}
      </button>
      {message && <div className={error ? "notice error" : "notice"}>{message}</div>}
    </div>
  );
}
