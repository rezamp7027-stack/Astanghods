import type {MetadataRoute} from "next";
export default function sitemap():MetadataRoute.Sitemap{
 const base="https://javanan.org";
 return ["/","/programs","/login","/dashboard"].map(path=>({url:base+path,lastModified:new Date()}));
}