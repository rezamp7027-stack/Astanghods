"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = string | null;

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تأییدشده",
  waitlisted: "صف انتظار",
  cancelled: "لغوشده",
};

function errorMessage(message: string) {
  if (message.includes("already_registered")) return "شما پیش‌تر برای این برنامه ثبت‌نام کرده‌اید.";
  if (message.includes("registration_not_open")) return "ثبت‌نام این برنامه هنوز شروع نشده است.";
  if (message.includes("registration_closed")) return "مهلت ثبت‌نام این برنامه تمام شده است.";
  if (message.includes("program_not_available")) return "این برنامه دیگر برای ثبت‌نام در دسترس نیست.";
  return "عملیات انجام نشد. لطفاً دوباره تلاش کنید.";
}

export function RegistrationButton({
  programId,
  initialStatus = null,
}: {
  programId: string;
  initialStatus?: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initialStatus);
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
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const { data, error } = await supabase.rpc("register_for_program", { p_program_id: programId });
    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage(errorMessage(error.message));
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;
    const nextStatus = (result?.registration_status as Status) ?? "confirmed";
    setStatus(nextStatus);
    setMessage(
      nextStatus === "waitlisted"
        ? `ظرفیت تکمیل است. شما در صف انتظار جایگاه ${result?.waitlist_position ?? "ثبت‌نشده"} قرار گرفتید.`
        : "ثبت‌نام با موفقیت انجام شد و این برنامه به مسیر شما اضافه شد.",
    );
  }

  async function cancel() {
    if (loading) return;
    const approved = window.confirm("ثبت‌نام این برنامه لغو شود؟");
    if (!approved) return;

    setLoading(true);
    setMessage(null);
    setIsError(false);
    const supabase = createClient();
    const { error } = await supabase.rpc("cancel_my_program_registration", { p_program_id: programId });
    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage("لغو ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.");
      return;
    }

    setStatus("cancelled");
    setMessage("ثبت‌نام شما لغو شد.");
  }

  const cancellable = status !== null && ["pending", "confirmed", "waitlisted"].includes(status);

  if (status && status !== "cancelled") {
    return (
      <div className="form-stack">
        <div className="notice">
          وضعیت ثبت‌نام: <strong>{statusLabels[status] ?? status}</strong>
        </div>
        {cancellable && <button className="btn btn-secondary" onClick={cancel} disabled={loading} type="button">
          {loading ? "در حال پردازش…" : "لغو ثبت‌نام"}
        </button>}
        {message && <div className={isError ? "notice error" : "notice"} role="status">{message}</div>}
      </div>
    );
  }

  return (
    <div className="form-stack">
      <button className="btn btn-primary" onClick={register} disabled={loading} type="button">
        {loading ? "در حال ثبت‌نام…" : status === "cancelled" ? "ثبت‌نام دوباره" : "ثبت‌نام در برنامه"}
      </button>
      {status === "cancelled" && !message ? <div className="notice">ثبت‌نام قبلی شما لغو شده است.</div> : null}
      {message && <div className={isError ? "notice error" : "notice"} role="status" aria-live="polite">{message}</div>}
    </div>
  );
}
