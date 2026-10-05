import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
type Role=Database["public"]["Enums"]["app_role"];
export async function currentUser(){const supabase=await createClient();const {data}=await supabase.auth.getClaims();if(!data?.claims?.sub)return null;return{supabase,userId:String(data.claims.sub)};}
export async function requireStaff(){const user=await currentUser();if(!user)redirect("/login?next=/admin");const {data,error}=await user.supabase.from("user_roles").select("roles(slug)").eq("user_id",user.userId);if(error)redirect("/dashboard");const roles=(data??[]).flatMap(row=>Array.isArray(row.roles)?row.roles:row.roles?[row.roles]:[]).map(row=>row.slug as Role);if(!roles.length)redirect("/dashboard");return{...user,roles};}
export async function requireMentor(){const user=await currentUser();if(!user)redirect("/login?next=/mentor");const {data}=await user.supabase.from("mentor_assignments").select("id").eq("mentor_user_id",user.userId).is("ended_at",null).limit(1);const {data:staff}=await user.supabase.rpc("has_any_role",{required_roles:["super_admin","mentor_manager"] as Role[]});if(!data?.length&&!staff)redirect("/dashboard");return user;}
export async function requireParent(){const user=await currentUser();if(!user)redirect("/login?next=/parent");const {data}=await user.supabase.from("parent_links").select("id").eq("parent_user_id",user.userId).eq("is_active",true).not("consented_at","is",null).limit(1);if(!data?.length)redirect("/dashboard");return user;}


export async function requireOrganizationMember() {
  const user=await currentUser();
  if(!user) redirect("/login?next=/organization");
  const {data}=await user.supabase.from("organization_members").select("organization_id,role_name,is_active").eq("user_id",user.userId).eq("is_active",true);
  if(!data?.length) redirect("/dashboard");
  return user;
}
