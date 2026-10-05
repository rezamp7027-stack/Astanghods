import Link from "next/link";
import { requireOrganizationMember } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import type { Database } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type MembershipRow = {
  organization_id: string;
  role_name: string;
  is_active: boolean;
  organizations: Organization | Organization[] | null;
};

export default async function OrganizationPage() {
  const { supabase, userId } = await requireOrganizationMember();
  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id,role_name,is_active,organizations(id,name,slug,organization_type,province_id,city,phone,email,website,description,is_active,created_at,updated_at)")
    .eq("user_id", userId)
    .eq("is_active", true);

  const rows = (memberships ?? []) as MembershipRow[];

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">سازمان من</span>
            <h1>پنل مجموعه</h1>
            <p>مجموعه‌ها و نقش‌های فعال حساب شما.</p>
          </div>

          <div className="admin-card-grid">
            {rows.map((row) => {
              const org = Array.isArray(row.organizations) ? row.organizations[0] : row.organizations;
              return (
                <article className="admin-card" key={row.organization_id}>
                  <span className="status">{row.role_name}</span>
                  <h2>{org?.name ?? "مجموعه"}</h2>
                  <p>{org?.city ?? ""}{org?.organization_type ? ` · ${org.organization_type}` : ""}</p>
                  <p>{org?.description ?? ""}</p>
                </article>
              );
            })}
          </div>

          {!rows.length && <div className="empty">هیچ عضویت سازمانی فعالی برای این حساب پیدا نشد.</div>}
          <Link className="btn btn-secondary" href="/dashboard" style={{ marginTop: 18 }}>بازگشت</Link>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}
