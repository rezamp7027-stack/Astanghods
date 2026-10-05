"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const labels: Record<string,string> = { pending:"در انتظار", confirmed:"تأییدشده", waitlisted:"صف انتظار", cancelled:"لغوشده" };

export function EventRegistrationButton({ eventId, initialStatus = null }: { eventId:string; initialStatus?:string|null }) {
  const router=useRouter();
  const [status,setStatus]=useState(initialStatus);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState<string|null>(null);
  const [isError,setIsError]=useState(false);

  function errorMessage(message:string) {
    if(message.includes("already_registered")) return "شما پیش‌تر برای این رویداد ثبت‌نام کرده‌اید.";
    if(message.includes("event_not_available")) return "این رویداد دیگر برای ثبت‌نام در دسترس نیست.";
    if(message.includes("authentication_required")) return "برای ثبت‌نام باید وارد حساب خود شوید.";
    return "عملیات انجام نشد. لطفاً دوباره تلاش کنید.";
  }

  async function register() {
    if(loading)return;
    setLoading(true);setMessage(null);setIsError(false);
    const supabase=createClient();
    const {data:claims}=await supabase.auth.getClaims();
    if(!claims?.claims?.sub){router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);return;}
    const {data,error}=await supabase.rpc("register_for_event",{p_event_id:eventId});
    setLoading(false);
    if(error){setIsError(true);setMessage(errorMessage(error.message));return;}
    const nextStatus=Array.isArray(data)?String(data[0]?.status??"confirmed"):String(data?.status??"confirmed");
    setStatus(nextStatus);
    setMessage(nextStatus==="waitlisted"?"ظرفیت تکمیل است و درخواست شما در صف انتظار قرار گرفت.":"ثبت‌نام شما با موفقیت انجام شد.");
  }

  async function cancel() {
    if(loading)return;
    if(!window.confirm("ثبت‌نام این رویداد لغو شود؟"))return;
    setLoading(true);setMessage(null);setIsError(false);
    const supabase=createClient();
    const {error}=await supabase.rpc("cancel_my_event_registration",{p_event_id:eventId});
    setLoading(false);
    if(error){setIsError(true);setMessage("لغو ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.");return;}
    setStatus("cancelled");setMessage("ثبت‌نام شما لغو شد.");
  }

  const cancellable=status!==null && ["pending","confirmed","waitlisted"].includes(status);
  if(status&&status!=="cancelled") return <div className="form-stack"><div className="notice">وضعیت ثبت‌نام: <strong>{labels[status]??status}</strong></div>{cancellable&&<button className="btn btn-secondary" type="button" onClick={cancel} disabled={loading}>{loading?"در حال پردازش…":"لغو ثبت‌نام"}</button>}{message&&<div className={isError?"notice error":"notice"} role="status">{message}</div>}</div>;

  return <div className="form-stack"><button className="btn btn-primary" type="button" onClick={register} disabled={loading}>{loading?"در حال ثبت‌نام…":status==="cancelled"?"ثبت‌نام دوباره":"ثبت‌نام در رویداد"}</button>{status==="cancelled"&&!message?<div className="notice">ثبت‌نام قبلی شما لغو شده است.</div>:null}{message&&<div className={isError?"notice error":"notice"} role="status" aria-live="polite">{message}</div>}</div>;
}
