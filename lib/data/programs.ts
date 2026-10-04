import type {Program} from "@/lib/demo-data";
import {programs as fallbackPrograms} from "@/lib/demo-data";
import {createSupabaseServerClient} from "@/lib/supabase/server";

type DbProgram={slug:string;title:string;summary:string|null;description:string|null;category:string|null;age_min:number|null;age_max:number|null;city:string|null;format:"onsite"|"online"|"hybrid";capacity:number|null;status:"draft"|"published"|"registration_open"|"full"|"archived"};

function mapProgram(row:DbProgram):Program{
 const age=row.age_min&&row.age_max?row.age_min+" تا "+row.age_max+" سال":"بدون محدودیت سنی";
 return {slug:row.slug,title:row.title,description:row.summary||row.description||"",longDescription:row.description||row.summary||"",category:row.category||"عمومی",age,ageGroup:row.age_min&&row.age_min<18?["نوجوان","جوان"]:["جوان"],city:row.city||"آنلاین",format:row.format==="online"?"آنلاین":row.format==="hybrid"?"ترکیبی":"حضوری",duration:"قابل مشاهده در جزئیات",capacity:row.capacity?String(row.capacity):"ظرفیت مشخص نشده",status:row.status==="registration_open"?"ثبت‌نام باز است":row.status==="full"?"تکمیل ظرفیت":row.status==="published"?"منتشر شده":"در دسترس",interests:row.category?[row.category]:[],outcomes:[]};
}
export async function getPrograms():Promise<Program[]>{
 const supabase=await createSupabaseServerClient(); if(!supabase)return fallbackPrograms;
 const{data,error}=await supabase.from("programs").select("slug,title,summary,description,category,age_min,age_max,city,format,capacity,status").in("status",["published","registration_open","full"]).order("starts_at",{ascending:true});
 return error||!data?fallbackPrograms:data.map(mapProgram);
}
export async function getProgramBySlug(slug:string){return (await getPrograms()).find(item=>item.slug===slug);}
