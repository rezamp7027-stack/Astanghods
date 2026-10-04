import {createSupabaseServerClient} from "@/lib/supabase/server";
export type AppRole="youth"|"parent"|"mentor"|"organization"|"admin";
export async function getCurrentProfile(){
 const supabase=await createSupabaseServerClient(); if(!supabase)return null;
 const{data,error}=await supabase.from("profiles").select("full_name,city,role,interests").maybeSingle();
 return error?null:data as {full_name:string|null;city:string|null;role:AppRole;interests:string[]}|null;
}