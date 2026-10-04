import Link from "next/link";
export function SectionHeading({kicker,title,text,action}:{kicker:string;title:string;text?:string;action?:{href:string;label:string}}){
  return <div className="section-heading"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2>{text&&<p>{text}</p>}</div>{action&&<Link href={action.href}>{action.label} ←</Link>}</div>;
}