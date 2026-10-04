import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/login?next=/dashboard/profile");

  const userId = String(claimsData.claims.sub);
  const email = String(claimsData.claims.email ?? "");
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name,full_name,phone,city,bio,onboarding_completed")
    .eq("id", userId)
    .single();

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="detail-card" style={{maxWidth:760, marginInline:"auto"}}>
            <span className="eyebrow">پروفایل</span>
            <h1 style={{fontSize:42}}>تکمیل مسیر شخصی</h1>
            <div className="callout">
              <strong>ایمیل حساب</strong><br />
              <span dir="ltr">{email || "ثبت نشده"}</span>
            </div>
            <ProfileForm
              userId={userId}
              initial={{
                displayName: profile?.display_name ?? "",
                fullName: profile?.full_name ?? "",
                phone: profile?.phone ?? "",
                city: profile?.city ?? "",
                bio: profile?.bio ?? "",
                onboardingCompleted: profile?.onboarding_completed ?? false,
              }}
            />
            <p className="lead" style={{fontSize:14}}>
              اطلاعات پروفایل برای شخصی‌سازی مسیر، پیشنهاد برنامه‌ها و ارتباط‌های بعدی استفاده می‌شود. داده‌های خصوصی این بخش در دسترس عمومی نیستند.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
