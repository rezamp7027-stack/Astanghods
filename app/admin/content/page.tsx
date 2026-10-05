import { requireStaff } from "@/lib/auth";
import { createContent } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const { supabase } = await requireStaff();
  const { data } = await supabase
    .from("content")
    .select("id,title,slug,status,content_type,published_at,updated_at")
    .order("updated_at", { ascending: false })
    .limit(200);
  const rows = data ?? [];

  return (
    <section>
      <div className="admin-head">
        <div>
          <span className="eyebrow">رسانه</span>
          <h1>مدیریت محتوا</h1>
          <p className="lead">مقالات و محتوای تاییدشده برای سایت و لایه AI.</p>
        </div>
      </div>
      <div className="admin-card">
        <form className="admin-form" action={createContent}>
          <fieldset>
            <legend>محتوای جدید</legend>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="title">عنوان *</label>
                <input id="title" name="title" required maxLength={220} />
              </div>
              <div className="field">
                <label htmlFor="slug">شناسه *</label>
                <input id="slug" name="slug" required pattern="[a-z0-9-]+" />
              </div>
              <div className="field">
                <label htmlFor="content_type">نوع محتوا</label>
                <select id="content_type" name="content_type" defaultValue="article">
                  <option value="article">مقاله</option>
                  <option value="video">ویدئو</option>
                  <option value="announcement">اطلاعیه</option>
                  <option value="guide">راهنما</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="status">وضعیت</label>
                <select id="status" name="status" defaultValue="draft">
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشرشده</option>
                  <option value="archived">بایگانی</option>
                </select>
              </div>
              <div className="field field-wide">
                <label htmlFor="summary">خلاصه</label>
                <textarea id="summary" name="summary" rows={3} />
              </div>
              <div className="field field-wide">
                <label htmlFor="body">بدنه JSON *</label>
                <textarea id="body" name="body" rows={10} required aria-describedby="body-help" />
                <small id="body-help">برای متن ساده، کلید text را داخل JSON قرار دهید.</small>
              </div>
            </div>
          </fieldset>
          <button className="btn btn-primary" type="submit">ذخیره محتوا</button>
        </form>
      </div>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">فهرست محتوا</caption>
          <thead>
            <tr><th scope="col">عنوان</th><th scope="col">نوع</th><th scope="col">وضعیت</th><th scope="col">به‌روزرسانی</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.title}</th>
                <td>{row.content_type}</td>
                <td><span className="status">{row.status}</span></td>
                <td>{new Date(row.updated_at).toLocaleDateString("fa-IR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
