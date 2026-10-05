"use client";
import{useEffect}from"react";import{usePathname}from"next/navigation";
export function AnalyticsTracker(){const p=usePathname();useEffect(()=>{fetch("/api/analytics",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({event_type:"page_view",metadata:{path:p}})}).catch(()=>{});},[p]);return null;}