"use client";
import { FormEvent, useState } from "react";

export function AssistantForm(){
 const [message,setMessage]=useState("");const [answer,setAnswer]=useState("");const [error,setError]=useState("");const [loading,setLoading]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!message.trim()||loading)return;setLoading(true);setError("");setAnswer("");
  try{const res=await fetch("/api/assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message})});const data=await res.json();if(!res.ok)throw new Error(data.error||"assistant_error");setAnswer(data.answer||"پاسخی دریافت نشد.");}
  catch(err){setError(err instanceof Error?err.message:"خطا در دریافت پاسخ.");}finally{setLoading(false);}
 }
 return <div className="assistant-box"><form onSubmit={submit} aria-describedby="assistant-help"><label htmlFor="assistant-message">سؤال شما</label><textarea id="assistant-message" name="message" required maxLength={2000} rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder="مثلاً: چه دوره‌هایی برای شروع مسیر مهارتی مناسب است؟" /><small id="assistant-help">پاسخ بر اساس محتوای رسمی منتشرشده در سامانه تولید می‌شود.</small><button className="btn btn-primary" type="submit" disabled={loading}>{loading?"در حال بررسی…":"پرسیدن سؤال"}</button></form>{answer&&<article className="admin-card" aria-live="polite"><h2>پاسخ دستیار</h2><p>{answer}</p></article>}{error&&<div className="empty" role="alert">پاسخ تولید نشد. {error}</div>}</div>;
}