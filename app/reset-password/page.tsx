"use client";
import {FormEvent,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {createBrowserClient} from "@/lib/supabase/client";
export default function ResetPasswordPage(){
 const[newPassword,setNewPassword]=useState(""),[status,setStatus]=useState(""),[loading,setLoading]=useState(false),router=useRouter();
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setStatus("");const supabase=createBrowserClient();if(!supabase){setStatus("اتصال Supabase هنوز تنظیم نشده است.");setLoading(false);return}const{error}=await supabase.auth.updateUser({password:newPassword});if(error)setStatus(error.message);else router.replace("/dashboard");setLoading(false)}
 return <main id="content" className="auth-shell"><div className="auth-card"><span className="eyebrow">رمز جدید</span><h1>رمزت را تازه کن.</h1><p>یک رمز عبور منحصربه‌فرد انتخاب کن.</p><form onSubmit={submit}><label htmlFor="current-password">رمز جدید<input id="current-password" name="password" type="password" autoComplete="new-password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} minLength={8} required /></label><button className="button button-primary button-full" disabled={loading}>{loading?"در حال ذخیره...":"ذخیره رمز جدید"}</button></form>{status&&<div className="form-message" role="alert">{status}</div>}<Link href="/login" className="back-link">← ورود</Link></div></main>;
}