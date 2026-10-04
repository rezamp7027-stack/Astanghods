import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
export async function GET(request:Request){
 const url=new URL(request.url),tokenHash=url.searchParams.get("token_hash"),type=url.searchParams.get("type"),next=url.searchParams.get("next")||"/dashboard";
 const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!tokenHash||!type||!supabaseUrl||!key)return NextResponse.redirect(new URL("/login?error=confirmation",request.url));
 const store=await cookies();
 const supabase=createServerClient(supabaseUrl,key,{cookies:{getAll:()=>store.getAll(),setAll(items){try{items.forEach(({name,value,options})=>store.set(name,value,options))}catch{}}}});
 const{error}=await supabase.auth.verifyOtp({type:type as "email"|"recovery",token_hash:tokenHash});
 return NextResponse.redirect(new URL(error?"/login?error=confirmation":next,request.url));
}