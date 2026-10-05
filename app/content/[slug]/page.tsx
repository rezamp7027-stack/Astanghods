import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Body = Record<string, unknown>;

function bodyText(body: unknown) {
  if (typeof body === "string") return body;
  if (!body || typeof body !== "object" || Array.isArray(body)) return "";
  const value = body as Body;
  for (const key of ["text", "description", "note", "summary"]) {
    if (typeof value[key] === "string") return value[key] as string;
  }
  return "";
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export default async function ContentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("content")
    .select("title,summary,body,content_type,published_at,source_published_at,is_historical,source_url,source_type,source_confidence,tags")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!item) notFound();

  const body = item.body && typeof item.body === "object" && !Array.isArray(item.body) ? item.body as Body : {};
  const text = bodyText(item.body);
  const statistics = body.statistics && typeof body.statistics === "object" && !Array.isArray(body.statistics)
    ? body.statistics as Record<string, unknown>
    : null;
  const reportedBooks = stringList(body.reported_book_titles);
  const date = item.source_published_at ?? item.published_at;

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container narrow">
          <div className="page-head">
            <div className="tag-row">
              <span className="eyebrow">{item.content_type}</span>
              {item.is_historical && <span className="tag">آرشیوی</span>}
            </div>
            <h1>{item.title}</h1>
            <p>{item.summary ?? ""}</p>
            {date && <small>{new Date(date).toLocaleDateString("fa-IR")}</small>}
          </div>

          <article className="reading-card">
            {text ? <p style={{ whiteSpace: "pre-wrap" }}>{text}</p> : null}

            {statistics && (
              <div className="metric-grid" style={{ marginTop: 24 }}>
                {Object.entries(statistics).map(([key, value]) => (
                  <div className="metric" key={key}>
                    <strong>{String(value)}</strong>
                    <span>{key.replaceAll("_", " ")}</span>
                  </div>
                ))}
              </div>
            )}

            {reportedBooks.length ? (
              <section style={{ marginTop: 24 }}>
                <h2>آثار گزارش‌شده</h2>
                <div className="tag-row">{reportedBooks.map((book) => <span className="tag" key={book}>{book}</span>)}</div>
              </section>
            ) : null}

            {body.speaker && typeof body.speaker === "string" ? (
              <div className="callout" style={{ marginTop: 24 }}><strong>سخنران/استاد</strong><br />{body.speaker}</div>
            ) : null}
          </article>

          <div className="detail-card" style={{ marginTop: 18 }}>
            <h2>منبع و ردیابی</h2>
            <p><strong>نوع منبع:</strong> {item.source_type ?? "ثبت نشده"}</p>
            <p><strong>سطح اعتماد:</strong> {item.source_confidence ?? "ثبت نشده"}</p>
            {item.is_historical && <div className="notice">این رکورد برای مستندسازی تاریخی است و لزوماً بیانگر وضعیت فعلی مؤسسه نیست.</div>}
            {item.tags?.length ? <div className="tag-row" style={{ marginTop: 12 }}>{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div> : null}
            {item.source_url && (
              <a className="btn btn-secondary" href={item.source_url} target="_blank" rel="noreferrer" style={{ marginTop: 18 }}>
                مشاهده منبع اصلی
              </a>
            )}
          </div>

          <Link className="btn btn-secondary" href="/content" style={{ marginTop: 18 }}>بازگشت به محتوا</Link>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}
