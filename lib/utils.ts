export const money=(n:number,c:string,s:string,p:"before"|"after")=>{const x=new Intl.NumberFormat("fa-IR",{maximumFractionDigits:0}).format(Number(n));return p==="before"?`${s||c} ${x}`:`${x} ${s||c}`};
export const txt=(fa:string,en:string,l:"fa"|"en")=>l==="en"&&en?.trim()?en:fa;
export const bytes=(n:number)=>n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(1)} MB`;