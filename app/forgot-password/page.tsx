"use client";
import {FormEvent,useState} from "react";
import Link from "next/link";
import {createBrowserClient} from "@/lib/supabase/client";
export default function ForgotPasswordPage(){
 const[email,setEmail]=useState(""),[status,setStatus]=useState(""),[loading,setLoading]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setStatus("");const supabase=createBrowserClient();if(!supabase){setStatus("اتصال Supabase هنوز تنظیم نشده است.");setLoading(false);return}const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+"/reset-password"});setStatus(error?error.message:"اگر این ایمیل در سامانه وجود داشته باشد، لینک بازیابی ارسال می‌شود.");setLoading(false)}
 return <main id="content" className="auth-shell"><div className="auth-card"><span className="eyebrow">بازیابی رمز</span><h1>رمز عبورت را برگردان.</h1><p>ایمیل حسابت را وارد کن تا لینک بازیابی برایت فرستاده شود.</p><form onSubmit={submit}><label htmlFor="email">ایمیل<input id="email" name="email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required /></label><button className="button button-primary button-full" disabled={loading}>{loading?"در حال ارسال...":"ارسال لینک بازیابی"}</button></form>{status&&<div className="form-message" aria-live="polite">{status}</div>}<Link href="/login" className="back-link">← بازگشت به ورود</Link></div></main>;
}