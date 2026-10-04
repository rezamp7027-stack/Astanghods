import {ProgramExplorer} from "@/components/program-explorer";
import {programs} from "@/lib/demo-data";
export const metadata={title:"برنامه‌ها | جوانان آستان قدس رضوی"};
export default function ProgramsPage(){return <main className="page-shell"><div className="container"><div className="page-intro"><span className="eyebrow">برنامه‌ها</span><h1>قدم بعدی‌ات را پیدا کن.</h1><p>دوره، اردو، نشست و فعالیت‌های اجتماعی را بر اساس سن، شهر و علاقه‌ات فیلتر کن.</p></div><ProgramExplorer programs={programs}/></div></main>}