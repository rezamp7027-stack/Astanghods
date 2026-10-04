"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import type {Program} from "@/lib/demo-data";
export function ProgramFinder({programs}:{programs:Program[]}){
 const[age,setAge]=useState("همه"),[city,setCity]=useState("همه"),[interest,setInterest]=useState("همه");
 const result=useMemo(()=>programs.filter(p=>(age==="همه"||p.ageGroup.includes(age))&&(city==="همه"||p.city===city)&&(interest==="همه"||p.interests.includes(interest))),[age,city,interest,programs]);
 const first=result[0];
 return <div className="finder"><div className="finder-panel"><div className="filter-row">
  <div className="field"><label htmlFor="finder-age">سن</label><select id="finder-age" value={age} onChange={e=>setAge(e.target.value)}><option>همه</option><option>نوجوان</option><option>جوان</option></select></div>
  <div className="field"><label htmlFor="finder-city">شهر</label><select id="finder-city" value={city} onChange={e=>setCity(e.target.value)}><option>همه</option><option>مشهد</option><option>آنلاین</option></select></div>
  <div className="field"><label htmlFor="finder-interest">علاقه</label><select id="finder-interest" value={interest} onChange={e=>setInterest(e.target.value)}><option>همه</option><option>معارف</option><option>مهارت</option><option>کتاب</option></select></div>
 </div><div className="finder-count">{result.length} برنامه از {programs.length} برنامه با انتخاب‌های فعلی سازگار است.</div>
 <div className="finder-results">{result.slice(0,4).map(p=><Link key={p.slug} href={"/programs/"+p.slug}>{p.title}</Link>)}</div></div>
 <div className="finder-result"><span className="mini-label">پیشنهاد اول</span><h3>{first?first.title:"فعلاً برنامه‌ای پیدا نشد."}</h3><p>{first?first.description:"فیلترها را کمی بازتر کن تا گزینه‌های بیشتری ببینیم."}</p>{first&&<Link className="button button-secondary" href={"/programs/"+first.slug}>مشاهده برنامه ←</Link>}</div></div>;
}