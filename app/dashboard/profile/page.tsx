import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/login?next=/dashboard/profile");

  const userId = String(claimsData.claims.sub);
  const [{ data: profile }, { data: user }] = await Promise.all([
    supabase.from("profiles").select("display_name,full_name,phone,city,bio,onboarding_completed").eq("id", userId).single(),
    supabase.auth.getUser(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="detail-card" style={{maxWidth:760, marginInline:"auto"}}>
            <span className="eyebrow">پروفایل</span>
            <h1 style={{fontSize:42}}>اطلاعات حساب</h1>
            <div className="form-stack">
              <div className="callout"><strong>ایمیل</strong><br />{user.user?.email ?? "ثبت نشده"}</div>
              <div className="callout"><strong>نام نمایشی</strong><br />{profile?.display_name ?? "تکمیل نشده"}</div>
              <div className="callout"><strong>نام و نام خانوادگی</strong><br />{profile?.full_name ?? "تکمیل نشده"}</div>
              <div className="callout"><strong>شهر</strong><br />{profile?.city ?? "تکمیل نشده"}</div>
            </div>
            <p className="lead" style={{fontSize:14}}>ویرایش کامل پروفایل در مرحله بعدی همین هسته اضافه می‌شود. فعلاً داده‌های حساس عمداً در رابط عمومی نمایش داده نمی‌شوند.</p>
          </div>
        </div>
      </main>
    </>
  );
}
