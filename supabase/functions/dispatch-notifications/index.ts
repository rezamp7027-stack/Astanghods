import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

type Delivery = { id:string; notification_id:string; channel:"in_app"|"sms"|"email"|"push"; attempts:number };
type Notification = { user_id:string; title:string; body:string };
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json"}});
async function resolveUser(req:Request,admin:any){const auth=req.headers.get("authorization")??"";const token=auth.startsWith("Bearer ")?auth.slice(7):"";if(!token)return null;const {data,error}=await admin.auth.getUser(token);return error||!data.user?null:data.user;}
async function sendEmail(to:string,subject:string,body:string){const apiKey=Deno.env.get("RESEND_API_KEY"),from=Deno.env.get("MAIL_FROM");if(!apiKey||!from)return {ok:false,retryable:false,error:"email_provider_not_configured"};const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},body:JSON.stringify({from,to,subject,text:body})});if(response.ok)return {ok:true,retryable:false};const detail=await response.text();return {ok:false,retryable:response.status>=500,error:"email_provider_"+response.status+":"+detail.slice(0,300)};}
async function sendSms(to:string,message:string){const url=Deno.env.get("SMS_PROVIDER_URL"),token=Deno.env.get("SMS_PROVIDER_TOKEN");if(!url||!token)return {ok:false,retryable:false,error:"sms_provider_not_configured"};const response=await fetch(url,{method:"POST",headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({to,message})});if(response.ok)return {ok:true,retryable:false};const detail=await response.text();return {ok:false,retryable:response.status>=500,error:"sms_provider_"+response.status+":"+detail.slice(0,300)};}
async function claimDelivery(admin:any,id:string,attempts:number){const {data,error}=await admin.from("notification_deliveries").update({status:"processing",attempts:attempts+1}).eq("id",id).eq("status","queued").select("id,notification_id,channel,attempts").maybeSingle();if(error)throw error;return data as Delivery|null;}
async function finish(admin:any,d:Delivery,result:{ok:boolean;retryable?:boolean;error?:string}){if(result.ok){await admin.from("notification_deliveries").update({status:"sent",sent_at:new Date().toISOString(),last_error:null}).eq("id",d.id);return;}const retry=Boolean(result.retryable)&&d.attempts<5;await admin.from("notification_deliveries").update({status:retry?"queued":"failed",scheduled_at:retry?new Date(Date.now()+Math.min(60,2**d.attempts)*60000).toISOString():null,last_error:result.error??"delivery_failed"}).eq("id",d.id);}
Deno.serve(async (req)=>{
  if(req.method!=="POST")return json({error:"method_not_allowed"},405);
  const url=Deno.env.get("SUPABASE_URL"),serviceRole=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");if(!url||!serviceRole)return json({error:"server_configuration_error"},500);
  const admin=createClient(url,serviceRole,{auth:{autoRefreshToken:false,persistSession:false}});
  const user=await resolveUser(req,admin);if(!user)return json({error:"unauthorized"},401);
  const {data:roles,error:roleError}=await admin.from("user_roles").select("roles(slug)").eq("user_id",user.id);if(roleError)return json({error:"authorization_check_failed"},500);
  const allowed=(roles??[]).some((row:any)=>{const v=Array.isArray(row.roles)?row.roles[0]:row.roles;return v?.slug==="super_admin"||v?.slug==="crm_manager";});if(!allowed)return json({error:"forbidden"},403);
  const body=await req.json().catch(()=>({}));const limit=Math.min(50,Math.max(1,Number(body.limit??25)));const now=new Date().toISOString();
  const {data:queued,error}=await admin.from("notification_deliveries").select("id,notification_id,channel,attempts").eq("status","queued").or("scheduled_at.is.null,scheduled_at.lte."+now).order("created_at",{ascending:true}).limit(limit);
  if(error)return json({error:"queue_read_failed"},500);
  let sent=0,failed=0,requeued=0,skipped=0;
  for(const raw of (queued??[]) as Delivery[]){
    const delivery=await claimDelivery(admin,raw.id,raw.attempts);if(!delivery){skipped++;continue;}
    const {data:notification}=await admin.from("notifications").select("user_id,title,body").eq("id",delivery.notification_id).maybeSingle();
    if(!notification){await finish(admin,delivery,{ok:false,retryable:false,error:"notification_not_found"});failed++;continue;}
    const n=notification as Notification;
    if(delivery.channel==="in_app"){await finish(admin,delivery,{ok:true});sent++;continue;}
    let result:{ok:boolean;retryable?:boolean;error?:string};
    if(delivery.channel==="email"){const {data:u}=await admin.auth.admin.getUserById(n.user_id);result=u.user?.email?await sendEmail(u.user.email,n.title,n.body):{ok:false,retryable:false,error:"recipient_email_missing"};}
    else if(delivery.channel==="sms"){const {data:p}=await admin.from("profiles").select("phone").eq("id",n.user_id).maybeSingle();result=p?.phone?await sendSms(p.phone,n.body):{ok:false,retryable:false,error:"recipient_phone_missing"};}
    else result={ok:false,retryable:false,error:"push_provider_not_configured"};
    await finish(admin,delivery,result);if(result.ok)sent++;else if(result.retryable&&delivery.attempts<5)requeued++;else failed++;
  }
  return json({ok:true,processed:(queued??[]).length,sent,failed,requeued,skipped});
});