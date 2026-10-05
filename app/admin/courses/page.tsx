import { requireStaff } from "@/lib/auth";
import { createCourse, createModule, createLesson } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const { supabase } = await requireStaff();
  const [{ data: courseData }, { data: moduleData }, { data: lessonData }] = await Promise.all([
    supabase.from("courses").select("id,title,slug,summary,is_published,created_at").order("created_at",{ascending:false}).limit(200),
    supabase.from("course_modules").select("id,course_id,title,sort_order").order("sort_order"),
    supabase.from("lessons").select("id,module_id,title,slug,is_published,sort_order").order("sort_order")
  ]);
  const courses=courseData??[], modules=moduleData??[], lessons=lessonData??[];
  const courseNames=new Map(courses.map(c=>[c.id,c.title]));
  const moduleNames=new Map(modules.map(m=>[m.id,courseNames.has(m.course_id)?courseNames.get(m.course_id)+" · ":""]));

  return <section>
    <div className="admin-head"><div><span className="eyebrow">LMS</span><h1>مدیریت دوره‌ها</h1><p className="lead">دوره، ماژول و درس را از یک مرکز مدیریت کنید.</p></div></div>
    <div className="admin-card-grid">{courses.map(course=><article className="admin-card" key={course.id}><span className="status">{course.is_published?"منتشرشده":"پیش‌نویس"}</span><h2>{course.title}</h2><p>{course.summary??""}</p><small>{modules.filter(m=>m.course_id===course.id).length} ماژول · {lessons.filter(l=>modules.some(m=>m.id===l.module_id&&m.course_id===course.id)).length} درس</small></article>)}</div>
    <div className="admin-card"><h2>ایجاد دوره</h2><form className="admin-form" action={createCourse}><fieldset><legend>دوره جدید</legend><div className="form-grid">
      <div className="field"><label htmlFor="course-title">عنوان *</label><input id="course-title" name="title" required maxLength={200}/></div>
      <div className="field"><label htmlFor="course-slug">شناسه *</label><input id="course-slug" name="slug" required pattern="[a-z0-9-]+" maxLength={100}/></div>
      <div className="field"><label htmlFor="is_published">وضعیت</label><select id="is_published" name="is_published"><option value="false">پیش‌نویس</option><option value="true">منتشرشده</option></select></div>
      <div className="field field-wide"><label htmlFor="course-summary">خلاصه</label><textarea id="course-summary" name="summary" rows={3}/></div>
      <div className="field field-wide"><label htmlFor="course-description">توضیحات</label><textarea id="course-description" name="description" rows={5}/></div>
    </div></fieldset><button className="btn btn-primary" type="submit">ایجاد دوره</button></form></div>
    <div className="admin-card"><h2>افزودن ماژول</h2><form className="admin-form" action={createModule}><fieldset><legend>ماژول</legend><div className="form-grid">
      <div className="field"><label htmlFor="module-course-id">دوره *</label><select id="module-course-id" name="course_id" required><option value="">انتخاب دوره</option>{courses.map(c=><option value={c.id} key={c.id}>{c.title}</option>)}</select></div>
      <div className="field"><label htmlFor="module-title">عنوان *</label><input id="module-title" name="title" required maxLength={200}/></div>
      <div className="field"><label htmlFor="module-sort">ترتیب</label><input id="module-sort" name="sort_order" type="number" min={0} defaultValue={0}/></div>
    </div></fieldset><button className="btn btn-secondary" type="submit" disabled={!courses.length}>افزودن ماژول</button></form></div>
    <div className="admin-card"><h2>افزودن درس</h2><form className="admin-form" action={createLesson}><fieldset><legend>درس</legend><div className="form-grid">
      <div className="field field-wide"><label htmlFor="lesson-module-id">ماژول *</label><select id="lesson-module-id" name="module_id" required><option value="">انتخاب ماژول</option>{modules.map(m=><option value={m.id} key={m.id}>{courseNames.get(m.course_id)??"دوره"} · {m.title}</option>)}</select></div>
      <div className="field"><label htmlFor="lesson-title">عنوان *</label><input id="lesson-title" name="title" required maxLength={200}/></div>
      <div className="field"><label htmlFor="lesson-slug">شناسه درس *</label><input id="lesson-slug" name="slug" required pattern="[a-z0-9-]+" maxLength={100}/></div>
      <div className="field"><label htmlFor="lesson-type">نوع</label><select id="lesson-type" name="lesson_type"><option value="article">مقاله</option><option value="video">ویدئو</option><option value="quiz">آزمون</option></select></div>
      <div className="field"><label htmlFor="lesson-duration">مدت دقیقه</label><input id="lesson-duration" name="duration_minutes" type="number" min={0}/></div>
      <div className="field"><label htmlFor="lesson-sort">ترتیب</label><input id="lesson-sort" name="sort_order" type="number" min={0} defaultValue={0}/></div>
      <div className="field field-wide"><label htmlFor="lesson-content">محتوا</label><textarea id="lesson-content" name="content" rows={8} placeholder='مثلاً {"text":"متن درس"}'/></div>
      <div className="field"><label htmlFor="lesson-published">انتشار</label><select id="lesson-published" name="is_published"><option value="false">پیش‌نویس</option><option value="true">منتشرشده</option></select></div>
    </div></fieldset><button className="btn btn-secondary" type="submit" disabled={!modules.length}>افزودن درس</button></form></div>
  </section>;
}
