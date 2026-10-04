"use client";
import {FormEvent,useState} from "react";
import Link from "next/link";
import {createBrowserClient} from "@/lib/supabase/client";
export default function RegisterPage(){
 const[name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[loading,setLoading]=useState(false),[status,setStatus]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setStatus("");const supabase=createBrowserClient();if(!supabase){setStatus("اتصال Supabase هنوز تنظیم نشده است.");setLoading(false);return}
 const{error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:window.location.origin+"/auth/confirm?next=/dashboard"}});
 setStatus(error?error.message:"ثبت‌نام انجام شد. اگر تأیید ایمیل فعال باشد، لینک ورود برایت ارسال می‌شود.");setLoading(false);
 }
 return <main id="content" className="auth-shell"><div className="auth-card"><span className="eyebrow">ساخت حساب</span><h1>مسیرت را شروع کن.</h1><p>فعلاً اطلاعات پایه را می‌گیریم. نقش‌ها و دسترسی‌های حساس بعداً بر اساس سیاست سازمان در دیتابیس تعیین می‌شوند.</p><form onSubmit={submit}><label htmlFor="name">نام و نام خانوادگی<input id="name" name="name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required /></label><label htmlFor="email">ایمیل<input id="email" name="email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label htmlFor="new-password">رمز عبور<input id="new-password" name="password" type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required /></label><button className="button button-primary button-full" disabled={loading}>{loading?"در حال ساخت حساب...":"ساخت حساب"}</button></form>{status&&<div className="form-message" aria-live="polite">{status}</div>}<div className="auth-links"><Link href="/login">قبلاً حساب داری؟ ورود</Link><Link href="/">← خانه</Link></div></div></main>;
}