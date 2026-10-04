import {NextResponse} from "next/server";
import {createSupabaseServerClient} from "@/lib/supabase/server";
export async function GET(){
 const configured=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
 if(!configured)return NextResponse.json({ok:true,supabase:"not-configured",mode:"fallback"});
 const supabase=await createSupabaseServerClient(); if(!supabase)return NextResponse.json({ok:false,supabase:"client-error"},{status:503});
 const{error}=await supabase.from("programs").select("id").limit(1);
 return NextResponse.json({ok:!error,supabase:error?"query-error":"connected"},{status:error?503:200});
}