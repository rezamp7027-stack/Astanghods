import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { updateContent } from "@/app/admin/actions";

export const dynamic="force-dynamic";

function bodyText(body:unknown){
 if(typeof body==="string") return body;
 if(body && typeof body==="object" && !Array.isArray(body) && typeof (body as {text?:unknown}).text==="string") return (body as {text:string}).text;
 return JSON.stringify(body ?? {},null,2);
}

export default async function EditContentPage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 const {supabase}=await requireStaff();
 const {data:item}=await supabase.from("content").select("id,title,slug,summary,body,content_type,status").eq("id",id).maybeSingle();
 if(!item)notFound();
 return <section>
  <div className="page-head"><span className="eyebrow">رسانه</span><h1>ویرایش محتوا</h1><p>{item.title}</p></div>
  <form className="admin-form" action={updateContent}>
   <input type="hidden" name="content_id" value={item.id}/>
   <fieldset><legend>محتوا</legend><div className="form-grid">
    <div className="field"><label htmlFor="title">عنوان *</label><input id="title" name="title" required defaultValue={item.title} maxLength={220}/></div>
    <div className="field"><label htmlFor="slug">شناسه *</label><input id="slug" name="slug" required pattern="[a-z0-9-]+" defaultValue={item.slug}/></div>
    <div className="field"><label htmlFor="content_type">نوع</label><select id="content_type" name="content_type" defaultValue={item.content_type}><option value="article">مقاله</option><option value="video">ویدئو</option><option value="announcement">اطلاعیه</option><option value="guide">راهنما</option></select></div>
    <div className="field"><label htmlFor="status">وضعیت</label><select id="status" name="status" defaultValue={item.status}><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option><option value="archived">بایگانی</option></select></div>
    <div className="field field-wide"><label htmlFor="summary">خلاصه</label><textarea id="summary" name="summary" rows={3} defaultValue={item.summary??""}/></div>
    <div className="field field-wide"><label htmlFor="body">بدنه *</label><textarea id="body" name="body" rows={18} required defaultValue={bodyText(item.body)}/></div>
   </div></fieldset>
   <div className="button-row"><button className="btn btn-primary" type="submit">ذخیره تغییرات</button><Link className="btn btn-secondary" href="/admin/content">بازگشت</Link></div>
  </form>
 </section>;
}
