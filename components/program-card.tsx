import Link from "next/link";
import type {Program} from "@/lib/demo-data";
export function ProgramCard({program}:{program:Program}){return <article className="program-card">
<div className="program-top"><span className="program-badge">{program.category}</span><span className="program-date">{program.status}</span></div>
<h3>{program.title}</h3><p>{program.description}</p>
<div className="program-meta"><span>{program.age}</span><span>{program.city}</span><span>{program.format}</span></div>
<div className="program-card-footer"><span>{program.duration}</span><Link href={"/programs/"+program.slug}>جزئیات ←</Link></div>
</article>}