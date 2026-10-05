"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
type Role=Database["public"]["Enums"]["app_role"];type ProgramStatus=Database["public"]["Enums"]["program_status"];type RegistrationStatus=Database["public"]["Enums"]["registration_status"];
function v(fd:FormData,k:string){const x=fd.get(k);return typeof x==="string"?x.trim():"";}
function n(fd:FormData,k:string){const x=v(fd,k);if(!x)return null;const y=Number(x);return Number.isFinite(y)?y:null;}
function d(fd:FormData,k:string){const x=v(fd,k);if(!x)return null;const y=new Date(x);return Number.isNaN(y.getTime())?null:y.toISOString();}
async function requireRole(roles:Role[]){const supabase=await createClient();const {data}=await supabase.auth.getClaims();if(!data?.claims?.sub)redirect("/login?next=/admin");const userId=String(data.claims.sub);const {data:allowed,error}=await supabase.rpc("has_any_role",{required_roles:roles});if(error||!allowed)redirect("/dashboard");return{supabase,userId};}
export async function createProgram(fd:FormData){const {supabase,userId}=await requireRole(["super_admin","program_manager"]);const title=v(fd,"title"),slug=v(fd,"slug").toLowerCase(),status=v(fd,"status") as ProgramStatus;const valid:ProgramStatus[]=["draft","published","registration_closed","running"];if(!title||!/^[a-z0-9-]+$/.test(slug)||!valid.includes(status))throw new Error("invalid_program_payload");const {data,error}=await supabase.from("programs").insert({title,slug,status,program_type:v(fd,"program_type")||"training",summary:v(fd,"summary")||null,description:v(fd,"description")||null,audience_min_age:n(fd,"min_age"),audience_max_age:n(fd,"max_age"),capacity:n(fd,"capacity"),city:v(fd,"city")||null,location_name:v(fd,"location_name")||null,start_at:d(fd,"start_at"),end_at:d(fd,"end_at"),registration_open_at:d(fd,"registration_open_at"),registration_close_at:d(fd,"registration_close_at"),published_at:status==="published"?new Date().toISOString():null,created_by:userId}).select("id").single();if(error)throw new Error(error.message);await supabase.from("audit_logs").insert({actor_user_id:userId,action:"program.create",entity_type:"program",entity_id:data.id,metadata:{title,slug}});redirect("/admin/programs");}
const registrationStatuses:RegistrationStatus[]=["pending","confirmed","waitlisted","cancelled","rejected","completed"];
export async function updateRegistrationStatus(fd:FormData){const {supabase,userId}=await requireRole(["super_admin","program_manager","crm_manager"]);const id=v(fd,"registration_id"),status=v(fd,"status") as RegistrationStatus;if(!id||!registrationStatuses.includes(status))throw new Error("invalid_registration_update");const {data,error}=await supabase.from("registrations").update({status}).eq("id",id).select("program_id,user_id,status").single();if(error)throw new Error(error.message);await supabase.from("audit_logs").insert({actor_user_id:userId,action:"registration.status_change",entity_type:"registration",entity_id:id,metadata:{program_id:data.program_id,user_id:data.user_id,status}});redirect("/admin/registrations");}
export async function promoteWaitlist(fd:FormData){const {supabase}=await requireRole(["super_admin","program_manager","crm_manager"]);const programId=v(fd,"program_id");if(!programId)throw new Error("program_required");const {error}=await supabase.rpc("admin_promote_waitlist",{p_program_id:programId});if(error)throw new Error(error.message);redirect("/admin/registrations");}


export async function createOrganization(formData: FormData) {
 const { supabase, userId } = await requireRole(["super_admin","regional_manager"]);
 const name=v(formData,"name"), slug=v(formData,"slug").toLowerCase();
 if(!name || !/^[a-z0-9-]+$/.test(slug)) throw new Error("invalid_organization_payload");
 const {data,error}=await supabase.from("organizations").insert({name,slug,organization_type:v(formData,"organization_type")||"school",city:v(formData,"city")||null,website:v(formData,"website")||null,description:v(formData,"description")||null}).select("id").single();
 if(error) throw new Error(error.message);
 await supabase.from("organization_directory").insert({organization_id:data.id,name,slug,organization_type:v(formData,"organization_type")||"school",city:v(formData,"city")||null,website:v(formData,"website")||null,description:v(formData,"description")||null});
 await supabase.from("audit_logs").insert({actor_user_id:userId,action:"organization.create",entity_type:"organization",entity_id:data.id,metadata:{name,slug}});
 redirect("/admin/network");
}

export async function assignMentor(formData: FormData) {
 const { supabase, userId } = await requireRole(["super_admin","mentor_manager"]);
 const mentor_user_id=v(formData,"mentor_user_id"), youth_user_id=v(formData,"youth_user_id"), program_id=v(formData,"program_id");
 if(!mentor_user_id || !youth_user_id || mentor_user_id===youth_user_id) throw new Error("invalid_mentor_assignment");
 const {data,error}=await supabase.from("mentor_assignments").insert({mentor_user_id,youth_user_id,program_id:program_id||null,assigned_by:userId}).select("id").single();
 if(error) throw new Error(error.message);
 await supabase.from("audit_logs").insert({actor_user_id:userId,action:"mentor.assign",entity_type:"mentor_assignment",entity_id:data.id,metadata:{mentor_user_id,youth_user_id,program_id:program_id||null}});
 redirect("/admin/mentors");
}

export async function createParentLink(formData: FormData) {
 const { supabase, userId } = await requireRole(["super_admin","mentor_manager"]);
 const parent_user_id=v(formData,"parent_user_id"), youth_user_id=v(formData,"youth_user_id"), relationship=v(formData,"relationship")||"parent";
 if(!parent_user_id || !youth_user_id || parent_user_id===youth_user_id) throw new Error("invalid_parent_link");
 const {data,error}=await supabase.from("parent_links").insert({parent_user_id,youth_user_id,relationship,is_active:true}).select("id").single();
 if(error) throw new Error(error.message);
 await supabase.from("audit_logs").insert({actor_user_id:userId,action:"parent.link_create",entity_type:"parent_link",entity_id:data.id,metadata:{parent_user_id,youth_user_id,relationship}});
 redirect("/admin/parents");
}

export async function markAttendance(formData: FormData) {
 const { supabase, userId } = await requireRole(["super_admin","program_manager","mentor_manager"]);
 const session_id=v(formData,"session_id"), user_id=v(formData,"user_id");
 const status=v(formData,"status");
 const allowed=["present","absent","late","excused"];
 if(!session_id || !user_id || !allowed.includes(status)) throw new Error("invalid_attendance_payload");
 const {error}=await supabase.from("attendance").upsert({session_id,user_id,status,checked_at:new Date().toISOString(),marked_by:userId,notes:v(formData,"notes")||null},{onConflict:"session_id,user_id"});
 if(error) throw new Error(error.message);
 redirect("/admin/attendance");
}

export async function issueCertificate(formData: FormData) {
 const { supabase, userId } = await requireRole(["super_admin","program_manager","content_manager"]);
 const user_id=v(formData,"user_id"),title=v(formData,"title"),certificate_number=v(formData,"certificate_number"),course_id=v(formData,"course_id"),program_id=v(formData,"program_id");
 if(!user_id || !title || !certificate_number || (!course_id&&!program_id)) throw new Error("invalid_certificate_payload");
 const {data,error}=await supabase.from("certificates").insert({user_id,title,certificate_number,course_id:course_id||null,program_id:program_id||null}).select("id").single();
 if(error) throw new Error(error.message);
 await supabase.from("audit_logs").insert({actor_user_id:userId,action:"certificate.issue",entity_type:"certificate",entity_id:data.id,metadata:{user_id,title,certificate_number}});
 redirect("/admin/certificates");
}

export async function createEvent(formData: FormData) {
 const { supabase, userId } = await requireRole(["super_admin","program_manager"]);
 const title=v(formData,"title"), slug=v(formData,"slug").toLowerCase(), starts_at=d(formData,"starts_at");
 if(!title || !/^[a-z0-9-]+$/.test(slug) || !starts_at) throw new Error("invalid_event_payload");
 const {data,error}=await supabase.from("events").insert({title,slug,summary:v(formData,"summary")||null,description:v(formData,"description")||null,starts_at,ends_at:d(formData,"ends_at"),venue_name:v(formData,"venue_name")||null,venue_address:v(formData,"venue_address")||null,city:v(formData,"city")||null,capacity:n(formData,"capacity"),is_public:v(formData,"is_public")!=="false",program_id:v(formData,"program_id")||null}).select("id").single();
 if(error) throw new Error(error.message);await supabase.from("audit_logs").insert({actor_user_id:userId,action:"event.create",entity_type:"event",entity_id:data.id,metadata:{title,slug}});redirect("/admin/events");
}
export async function createEventSession(formData: FormData) {
 const { supabase } = await requireRole(["super_admin","program_manager"]);
 const event_id=v(formData,"event_id"),title=v(formData,"title"),starts_at=d(formData,"starts_at");
 if(!event_id||!title||!starts_at)throw new Error("invalid_session_payload");
 const {error}=await supabase.from("event_sessions").insert({event_id,title,starts_at,ends_at:d(formData,"ends_at"),location_name:v(formData,"location_name")||null,capacity:n(formData,"capacity")});if(error)throw new Error(error.message);redirect("/admin/events");
}
export async function createContent(formData: FormData) {
 const { supabase, userId } = await requireRole(["super_admin","content_manager"]);
 const title=v(formData,"title"),slug=v(formData,"slug").toLowerCase(),summary=v(formData,"summary"),body=v(formData,"body"),status=v(formData,"status");
 if(!title||!/^[a-z0-9-]+$/.test(slug)||!body||!["draft","published","archived"].includes(status))throw new Error("invalid_content_payload");
 let parsed:unknown;try{parsed=JSON.parse(body);}catch{parsed={text:body};}
 const {data,error}=await supabase.from("content").insert({title,slug,summary:summary||null,body:parsed as never,status:status as never,published_at:status==="published"?new Date().toISOString():null,author_id:userId}).select("id").single();if(error)throw new Error(error.message);await supabase.from("audit_logs").insert({actor_user_id:userId,action:"content.create",entity_type:"content",entity_id:data.id,metadata:{title,slug,status}});redirect("/admin/content");
}
export async function dispatchNotifications() {
 const { supabase } = await requireRole(["super_admin","crm_manager"]);
 const {error}=await supabase.functions.invoke("dispatch-notifications",{body:{limit:50}});if(error)throw new Error(error.message);redirect("/admin/notifications");
}

export async function createVolunteerOpportunity(formData: FormData) {
 const { supabase, userId } = await requireRole(["super_admin","regional_manager","crm_manager"]);
 const title=v(formData,"title"), slug=v(formData,"slug").toLowerCase(), status=v(formData,"status")||"draft";
 if(!title||!/^[a-z0-9-]+$/.test(slug)||!["draft","published","closed","completed"].includes(status)) throw new Error("invalid_volunteer_opportunity");
 const skills=v(formData,"skills").split(",").map(x=>x.trim()).filter(Boolean).slice(0,20);
 const {data,error}=await supabase.from("volunteer_opportunities").insert({title,slug,status,summary:v(formData,"summary")||null,description:v(formData,"description")||null,skills,city:v(formData,"city")||null,starts_at:d(formData,"starts_at"),ends_at:d(formData,"ends_at"),capacity:n(formData,"capacity"),created_by:userId}).select("id").single();
 if(error)throw new Error(error.message);
 await supabase.from("audit_logs").insert({actor_user_id:userId,action:"volunteer.opportunity.create",entity_type:"volunteer_opportunity",entity_id:data.id,metadata:{title,slug}});
 redirect("/admin/volunteer");
}
export async function updateVolunteerAssignment(formData: FormData) {
 const {supabase,userId}=await requireRole(["super_admin","regional_manager","crm_manager"]);
 const id=v(formData,"assignment_id"),status=v(formData,"status");
 if(!id||!["applied","selected","confirmed","cancelled","completed"].includes(status))throw new Error("invalid_volunteer_assignment");
 const {data,error}=await supabase.from("volunteer_assignments").update({status,confirmed_at:status==="confirmed"?new Date().toISOString():null,completed_at:status==="completed"?new Date().toISOString():null}).eq("id",id).select("opportunity_id,user_id,status").single();
 if(error)throw new Error(error.message);
 await supabase.from("audit_logs").insert({actor_user_id:userId,action:"volunteer.assignment.update",entity_type:"volunteer_assignment",entity_id:id,metadata:{opportunity_id:data.opportunity_id,user_id:data.user_id,status}});
 redirect("/admin/volunteer");
}
export async function createCourse(formData:FormData){
 const {supabase,userId}=await requireRole(["super_admin","content_manager","program_manager"]);
 const title=v(formData,"title"),slug=v(formData,"slug").toLowerCase();
 if(!title||!/^[a-z0-9-]+$/.test(slug))throw new Error("invalid_course_payload");
 const {data,error}=await supabase.from("courses").insert({title,slug,summary:v(formData,"summary")||null,description:v(formData,"description")||null,is_published:v(formData,"is_published")==="true",created_by:userId}).select("id").single();
 if(error)throw new Error(error.message);
 await supabase.from("audit_logs").insert({actor_user_id:userId,action:"course.create",entity_type:"course",entity_id:data.id,metadata:{title,slug}});
 redirect("/admin/courses");
}
export async function createModule(formData:FormData){
 const {supabase}=await requireRole(["super_admin","content_manager","program_manager"]);
 const course_id=v(formData,"course_id"),title=v(formData,"title");if(!course_id||!title)throw new Error("invalid_module_payload");
 const {error}=await supabase.from("course_modules").insert({course_id,title,sort_order:n(formData,"sort_order")??0});if(error)throw new Error(error.message);redirect("/admin/courses");
}
export async function createLesson(formData:FormData){
 const {supabase}=await requireRole(["super_admin","content_manager","program_manager"]);
 const module_id=v(formData,"module_id"),title=v(formData,"title"),slug=v(formData,"slug").toLowerCase();if(!module_id||!title||!/^[a-z0-9-]+$/.test(slug))throw new Error("invalid_lesson_payload");
 let content:unknown={};const raw=v(formData,"content");if(raw){try{content=JSON.parse(raw);}catch{content={text:raw};}}
 const {error}=await supabase.from("lessons").insert({module_id,title,slug,lesson_type:v(formData,"lesson_type")||"article",duration_minutes:n(formData,"duration_minutes"),sort_order:n(formData,"sort_order")??0,is_published:v(formData,"is_published")==="true",content:content as never});
 if(error)throw new Error(error.message);redirect("/admin/courses");
}


export async function sendNotification(formData:FormData){const {supabase,userId}=await requireRole(["super_admin","crm_manager"]);const target=v(formData,"user_id"),title=v(formData,"title"),body=v(formData,"body");if(!target||!title||!body)throw new Error("invalid_notification_payload");const {data:n,error}=await supabase.from("notifications").insert({user_id:target,title,body,notification_type:v(formData,"notification_type")||"system"}).select("id").single();if(error)throw new Error(error.message);const {data:prefs}=await supabase.from("notification_preferences").select("in_app,email,sms,push").eq("user_id",target).maybeSingle();const channels=(prefs??{in_app:true,email:false,sms:false,push:false});const deliveries=[];if(channels.in_app)deliveries.push({notification_id:n.id,channel:"in_app",status:"queued"});if(channels.email)deliveries.push({notification_id:n.id,channel:"email",status:"queued"});if(channels.sms)deliveries.push({notification_id:n.id,channel:"sms",status:"queued"});if(channels.push)deliveries.push({notification_id:n.id,channel:"push",status:"queued"});if(deliveries.length){const {error:de}=await supabase.from("notification_deliveries").insert(deliveries);if(de)throw new Error(de.message);}await supabase.from("audit_logs").insert({actor_user_id:userId,action:"notification.create",entity_type:"notification",entity_id:n.id,metadata:{target,title,channels:deliveries.map(x=>x.channel)}});redirect("/admin/notifications");}
export async function setUserRole(formData:FormData){const {supabase}=await requireRole(["super_admin"]);const user_id=v(formData,"user_id");const role=v(formData,"role");const enabled=v(formData,"enabled")==="true";if(!user_id||!role)throw new Error("role_payload_invalid");const {error}=await supabase.rpc("admin_set_user_role",{p_user_id:user_id,p_role:role,p_enabled:enabled});if(error)throw new Error(error.message);redirect("/admin/users");}
export async function updateSupportRequest(formData:FormData){const {supabase,userId}=await requireRole(["super_admin","crm_manager"]);const id=v(formData,"request_id"),status=v(formData,"status");if(!id||!["open","in_progress","resolved","closed"].includes(status))throw new Error("support_status_invalid");const {error}=await supabase.from("support_requests").update({status,resolved_at:["resolved","closed"].includes(status)?new Date().toISOString():null}).eq("id",id);if(error)throw new Error(error.message);await supabase.from("audit_logs").insert({actor_user_id:userId,action:"support.status_change",entity_type:"support_request",entity_id:id,metadata:{status}});redirect("/admin/support");}
export async function createJourney(formData:FormData){
 const {supabase,userId}=await requireRole(["super_admin","crm_manager"]);
 const name=v(formData,"name"),slug=v(formData,"slug").toLowerCase(),trigger_type=v(formData,"trigger_type")||"manual";
 if(!name||!/^[a-z0-9-]+$/.test(slug))throw new Error("invalid_journey_payload");
 const {data,error}=await supabase.from("journeys").insert({name,slug,trigger_type,description:v(formData,"description")||null,is_active:true}).select("id").single();
 if(error)throw new Error(error.message);
 await supabase.from("audit_logs").insert({actor_user_id:userId,action:"journey.create",entity_type:"journey",entity_id:data.id,metadata:{name,slug,trigger_type}});
 redirect("/admin/journeys");
}
export async function createJourneyStep(formData:FormData){
 const {supabase}=await requireRole(["super_admin","crm_manager"]);
 const journey_id=v(formData,"journey_id"),action_type=v(formData,"action_type"),step_order=n(formData,"step_order");
 if(!journey_id||!action_type||step_order===null||step_order<1)throw new Error("invalid_journey_step");
 let config:unknown={};const raw=v(formData,"config");if(raw){try{config=JSON.parse(raw);}catch{config={text:raw};}}
 const {error}=await supabase.from("journey_steps").insert({journey_id,action_type,step_order,delay_minutes:n(formData,"delay_minutes")??0,config:config as never});
 if(error)throw new Error(error.message);redirect("/admin/journeys");
}
