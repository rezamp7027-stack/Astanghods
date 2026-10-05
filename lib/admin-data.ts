import{createClient}from"@/lib/supabase/server";
export async function dashboardData(){const s=await createClient();const[a,b,c,d,e,f]=await Promise.all([
s.from("menu_items").select("id",{count:"exact",head:true}).is("deleted_at",null),
s.from("menu_categories").select("id",{count:"exact",head:true}).is("deleted_at",null),
s.from("media").select("id",{count:"exact",head:true}).is("deleted_at",null),
s.from("reservations").select("id",{count:"exact",head:true}).eq("status","pending"),
s.from("special_offers").select("id",{count:"exact",head:true}).eq("is_active",true),
s.from("audit_logs").select("*").order("created_at",{ascending:false}).limit(8)
]);return{items:a.count??0,categories:b.count??0,media:c.count??0,pendingReservations:d.count??0,offers:e.count??0,recentAudit:f.data??[]};}