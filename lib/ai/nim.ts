type Message={role:"system"|"user"|"assistant";content:string};
type ChatResponse={choices?:Array<{message?:{content?:string}}>};

function env(name:string){const value=process.env[name];return value?.trim()||"";}

export async function askNim(messages:Message[],options?:{temperature?:number;maxTokens?:number}){
 const apiKey=env("NVIDIA_NIM_API_KEY");const baseUrl=(env("NVIDIA_NIM_BASE_URL")||"https://integrate.api.nvidia.com/v1").replace(/\/$/,"");
 const model=env("NVIDIA_NIM_MODEL")||"nvidia/nemotron-3-super-120b-a12b";
 if(!apiKey) throw new Error("ai_provider_not_configured");
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25_000);
 try{
  const response=await fetch(baseUrl+"/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({model,messages,temperature:options?.temperature??0.2,max_tokens:Math.min(options?.maxTokens??700,1200),stream:false}),signal:controller.signal});
  const raw=await response.text();
  if(!response.ok) throw new Error("ai_provider_http_"+response.status);
  let data:ChatResponse;try{data=JSON.parse(raw) as ChatResponse;}catch{throw new Error("ai_provider_invalid_json");}
  const answer=data.choices?.[0]?.message?.content?.trim();if(!answer)throw new Error("ai_provider_empty_response");return answer;
 }catch(error){if(error instanceof Error&&error.name==="AbortError")throw new Error("ai_provider_timeout");throw error;}finally{clearTimeout(timer);}
}