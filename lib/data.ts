import{createClient}from"@/lib/supabase/server";import type{Settings,Theme,Section,NavItem,Social,Category,MenuItem,Media,Gallery,Offer,SEO}from"@/lib/types";
export async function publicData(){const s=await createClient();const[{data:settings},{data:theme},{data:sections},{data:nav},{data:social},{data:categories},{data:items},{data:media},{data:gallery},{data:offers},{data:seo}]=await Promise.all([
s.from("restaurant_settings").select("*").single(),s.from("theme_settings").select("*").single(),s.from("site_sections").select("*").eq("enabled",true).order("sort_order"),
s.from("navigation_items").select("*").eq("is_enabled",true).order("sort_order"),s.from("social_links").select("*").eq("is_enabled",true).order("sort_order"),
s.from("menu_categories").select("*").eq("is_active",true).is("deleted_at",null).order("sort_order"),
s.from("menu_items").select("*,category:menu_categories(*),media:media(*)").is("deleted_at",null).order("sort_order"),
s.from("media").select("*").is("deleted_at",null).order("created_at",{ascending:false}),s.from("gallery_items").select("*,media:media(*)").eq("is_enabled",true).is("deleted_at",null).order("sort_order"),
s.from("special_offers").select("*,media:media(*)").eq("is_active",true).lte("starts_at",new Date().toISOString()).gte("ends_at",new Date().toISOString()),
s.from("seo_settings").select("*").single()
]);return{settings:settings as Settings,theme:theme as Theme,sections:(sections??[]) as Section[],nav:(nav??[]) as NavItem[],social:(social??[]) as Social[],categories:(categories??[]) as Category[],items:(items??[]) as MenuItem[],media:(media??[]) as Media[],gallery:(gallery??[]) as Gallery[],offers:(offers??[]) as Offer[],seo:seo as SEO};}