import {ProgramExplorer} from "@/components/program-explorer";
import {getPrograms} from "@/lib/data/programs";
export const dynamic="force-dynamic";
export const metadata={title:"برنامه‌ها | جوانان آستان قدس رضوی"};
export default async function ProgramsPage(){const programs=await getPrograms();return <main className="page-shell"><div className="container"><div className="page-intro"><span className="eyebrow">برنامه‌ها</span><h1>قدم بعدی‌ات را پیدا کن.</h1><p>دوره، اردو، نشست و فعالیت‌های اجتماعی را بر اساس سن، شهر و علاقه‌ات فیلتر کن.</p></div><ProgramExplorer programs={programs}/></div></main>}