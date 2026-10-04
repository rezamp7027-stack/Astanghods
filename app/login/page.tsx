"use client";
import {FormEvent,useState} from "react";
import Link from "next/link";
import {createBrowserClient} from "@/lib/supabase/client";
export default function LoginPage(){
 const[value,setValue]=useState(""),[password,setPassword]=useState(""),[loading,setLoading]=useState(false),[status,setStatus]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setStatus("");const supabase=createBrowserClient();
 if(!supabase){setStatus("اتصال Supabase هنوز در محیط اجرا تنظیم نشده است.");setLoading(false);return}
 const credentials=value.includes("@")?{email:value,password}:{phone:value,password};
 const result=await supabase.auth.signInWithPassword(credentials);
 if(result.error)setStatus(result.error.message);else window.location.assign("/dashboard");setLoading(false);
 }
 return <main id="content" className="auth-shell"><div className="auth-card"><span className="eyebrow">حساب کاربری</span><h1>به مسیرت برگرد.</h1><p>با ایمیل یا شماره موبایل و رمز عبور وارد شو.</p><form onSubmit={submit}><label htmlFor="identifier">ایمیل یا موبایل<input id="identifier" autoComplete="username" value={value} onChange={e=>setValue(e.target.value)} required /></label><label htmlFor="password">رمز عبور<input id="password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required /></label><button className="button button-primary button-full" disabled={loading}>{loading?"در حال ورود...":"ورود به مسیر من"}</button></form>{status&&<div className="form-message">{status}</div>}<Link href="/" className="back-link">← بازگشت</Link></div></main>;
}