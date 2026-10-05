import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
type Enrollment={id:string;journey_id:string;user_id:string;current_step:number;status:string};
type Step={id:string;journey_id:string;step_order:number;action_type:string;delay_minutes:number;config:Record<string,unknown>};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json"}});
async function authUser(req:Request,admin:any){const auth=req.headers.get("authorization")??"";const token=auth.startsWith("Bearer ")?auth.slice(7):"";if(!token)return null;const {data,error}=await admin.auth.getUser(token);return error||!data.user?null:data.user;}
Deno.serve(async(req)=>{
 if(req.method!=="POST")return json({error:"method_not_allowed"},405);
 const url=Deno.env.get("SUPABASE_URL"),secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");if(!url||!secret)return json({error:"server_configuration_error"},500);
 const admin=createClient(url,secret,{auth:{autoRefreshToken:false,persistSession:false}});
 const user=await authUser(req,admin);if(!user)return json({error:"unauthorized"},401);
 const {data:roles}=await admin.from("user_roles").select("roles(slug)").eq("user_id",user.id);
 const allowed=(roles??[]).some((x:any)=>{const r=Array.isArray(x.roles)?x.roles[0]:x.roles;return r?.slug==="super_admin"||r?.slug==="crm_manager";});if(!allowed)return json({error:"forbidden"},403);
 const body=await req.json().catch(()=>({}));const limit=Math.min(50,Math.max(1,Number(body.limit??25)));
 const {data:items,error}=await admin.from("journey_enrollments").select("id,journey_id,user_id,current_step,status").eq("status","active").or("next_run_at.is.null,next_run_at.lte."+new Date().toISOString()).order("next_run_at",{ascending:true}).limit(limit);
 if(error)return json({error:"queue_read_failed"},500);let processed=0,completed=0,skipped=0;
 for(const enrollment of (items??[]) as Enrollment[]){
  const {data:step}=await admin.from("journey_steps").select("id,journey_id,step_order,action_type,delay_minutes,config").eq("journey_id",enrollment.journey_id).eq("step_order",enrollment.current_step).maybeSingle();
  if(!step){await admin.from("journey_enrollments").update({status:"completed",completed_at:new Date().toISOString(),next_run_at:null}).eq("id",enrollment.id);completed++;continue;}
  if(step.action_type==="notification"){const title=typeof step.config?.title==="string"?step.config.title:"پیام مسیر شما";const bodyText=typeof step.config?.body==="string"?step.config.body:"یک گام جدید در مسیر شما آماده است.";const {data:n}=await admin.from("notifications").insert({user_id:enrollment.user_id,title,body:bodyText,notification_type:"journey",data:{journey_id:enrollment.journey_id,step_id:step.id}}).select("id").single();if(n)await admin.from("notification_deliveries").insert({notification_id:n.id,channel:"in_app",status:"queued"});}
  const {data:next}=await admin.from("journey_steps").select("step_order,delay_minutes").eq("journey_id",enrollment.journey_id).gt("step_order",enrollment.current_step).order("step_order",{ascending:true}).limit(1).maybeSingle();
  if(next){const nextRun=new Date(Date.now()+Number(next.delay_minutes??0)*60000).toISOString();await admin.from("journey_enrollments").update({current_step:next.step_order,next_run_at:nextRun}).eq("id",enrollment.id);processed++;}else{await admin.from("journey_enrollments").update({status:"completed",completed_at:new Date().toISOString(),next_run_at:null}).eq("id",enrollment.id);processed++;completed++;}
 }
 return json({ok:true,processed,completed,skipped});
});