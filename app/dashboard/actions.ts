"use server";import { redirect } from "next/navigation";import { createClient } from "@/lib/supabase/server";export async function consentParentLink(formData:FormData){const linkId=formData.get("link_id");if(typeof linkId!=="string"||!linkId)throw new Error("link_required");const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login?next=/dashboard/consent");const {error}=await supabase.rpc("consent_parent_link",{p_link_id:linkId});if(error)throw new Error(error.message);redirect("/dashboard/consent");}
function field(formData:FormData,key:string){const raw=formData.get(key);return typeof raw==="string"?raw.trim():"";}
export async function saveVolunteerProfile(formData:FormData){
 const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login?next=/dashboard/volunteer");
 const userId=String(claims.claims.sub);
 const skills=field(formData,"skills").split(",").map(x=>x.trim()).filter(Boolean).slice(0,30);
 const interests=field(formData,"interests").split(",").map(x=>x.trim()).filter(Boolean).slice(0,30);
 const {error}=await supabase.from("volunteer_profiles").upsert({user_id:userId,skills,interests,city:field(formData,"city")||null,bio:field(formData,"bio")||null,is_active:true},{onConflict:"user_id"});
 if(error)throw new Error(error.message);
 await supabase.from("engagement_events").insert({user_id:userId,event_type:"volunteer_profile_saved",source:"volunteer",metadata:{skills_count:skills.length,interests_count:interests.length}});
 redirect("/dashboard/volunteer");
}
export async function applyVolunteer(formData:FormData){
 const opportunityId=formData.get("opportunity_id");if(typeof opportunityId!=="string"||!opportunityId)throw new Error("opportunity_required");
 const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login?next=/volunteer");
 const {error}=await supabase.rpc("apply_volunteer_opportunity",{p_opportunity_id:opportunityId});if(error)throw new Error(error.message);
 redirect("/dashboard/volunteer");
}


export async function markNotificationRead(formData:FormData){const id=formData.get("notification_id");if(typeof id!=="string"||!id)throw new Error("notification_required");const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login?next=/dashboard/notifications");const {error}=await supabase.from("notifications").update({read_at:new Date().toISOString()}).eq("id",id).eq("user_id",String(claims.claims.sub));if(error)throw new Error(error.message);redirect("/dashboard/notifications");}
export async function saveNotificationPreferences(formData:FormData){const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login?next=/dashboard/notifications/preferences");const userId=String(claims.claims.sub);const {error}=await supabase.from("notification_preferences").upsert({user_id:userId,in_app:formData.get("in_app")==="on",email:formData.get("email")==="on",sms:formData.get("sms")==="on",push:formData.get("push")==="on"},{onConflict:"user_id"});if(error)throw new Error(error.message);redirect("/dashboard/notifications/preferences");}
export async function createSupportRequest(formData:FormData){const subject=String(formData.get("subject")??"").trim(),body=String(formData.get("body")??"").trim(),category=String(formData.get("category")??"general"),priority=String(formData.get("priority")??"normal");if(!subject||!body||subject.length>200||body.length>5000)throw new Error("support_payload_invalid");const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login?next=/dashboard/support");const {error}=await supabase.from("support_requests").insert({user_id:String(claims.claims.sub),subject,body,category,priority});if(error)throw new Error(error.message);redirect("/dashboard/support");}
