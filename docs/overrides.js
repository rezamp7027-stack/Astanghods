
(function(){
  const originalContentPanel=window.contentPanel;
  const originalThemePanel=window.themePanel;
  const originalDashboardPanel=window.dashboardPanel;
  const originalAdminNav=window.adminNav;

  window.adminNav=function(id,label,icon){
    if((id==="theme"||id==="seo"||id==="users")&&!canSuper())return "";
    if(id==="content"&&!isStaff())return "";
    return originalAdminNav(id,label,icon);
  };

  window.contentPanel=async function(){
    await originalContentPanel();
    const p=$("#adminPanel"); if(!p)return;
    const hero=heroSection();
    const opts="<option value=''>بدون تصویر</option>"+S.media.map(m=>"<option value='"+m.id+"' "+(m.id===hero.image_media_id?"selected":"")+">"+esc(m.filename)+"</option>").join("");
    const logo=S.settings.logo_media_id||"";
    const logoOpts="<option value=''>متنی</option>"+S.media.map(m=>"<option value='"+m.id+"' "+(m.id===logo?"selected":"")+">"+esc(m.filename)+"</option>").join("");
    const navs=(await sb.from("navigation_items").select("*").order("sort_order")).data||[];
    const socials=(await sb.from("social_links").select("*").order("sort_order")).data||[];
    p.insertAdjacentHTML("afterbegin",
      "<div class='grid two'>"+
      "<div class='card'><h2>هویت و Header</h2><form class='form' onsubmit='setBranding(event)'><label>تصویر اصلی هدر<select name='hero_image_id'>"+opts+"</select></label><label>لوگوی هدر<select name='logo_media_id'>"+logoOpts+"</select></label><button class='btn'>ذخیره تصاویر هدر</button></form></div>"+
      "<div class='card'><h2>Navigation</h2>"+navs.map(n=>"<form class='form' style='margin-top:10px' onsubmit='updateNavigation(event)'><input type='hidden' name='id' value='"+n.id+"'><div class='form-grid'><label>عنوان<input name='label' value='"+esc(n.label)+"'></label><label>لینک<input name='href' value='"+esc(n.href)+"'></label></div><button class='btn small secondary'>ذخیره</button></form>").join("")+"</div></div>"+
      "<div class='card' style='margin-top:15px'><h2>شبکه‌های اجتماعی</h2>"+socials.map(x=>"<form class='form-grid' style='margin-top:10px' onsubmit='updateSocial(event)'><input type='hidden' name='id' value='"+x.id+"'><label>"+esc(x.label)+"<input name='url' value='"+esc(x.url)+"' placeholder='https://...'></label><label class='check'><input name='is_enabled' type='checkbox' "+(x.is_enabled?"checked":"")+"> نمایش</label><button class='btn small secondary'>ذخیره</button></form>").join("")+"</div>");
  };

  window.setBranding=async function(e){
    e.preventDefault(); const f=new FormData(e.target), heroId=f.get("hero_image_id")||null, logoId=f.get("logo_media_id")||null;
    const a=await sb.from("restaurant_settings").update({logo_media_id:logoId}).eq("id","00000000-0000-0000-0000-000000000001");
    if(a.error){toast(a.error.message,"error");return}
    const b=await sb.from("site_sections").update({image_media_id:heroId}).eq("section_key","hero");
    if(b.error){toast(b.error.message,"error");return}
    toast("تصاویر Header و برند ذخیره شد.","ok");await fetchPublic();renderAdmin();
  };

  window.updateNavigation=async function(e){
    e.preventDefault();const f=new FormData(e.target);
    const {error}=await sb.from("navigation_items").update({label:String(f.get("label")||"").trim(),href:String(f.get("href")||"").trim()}).eq("id",f.get("id"));
    if(error)toast(error.message,"error");else{toast("Navigation ذخیره شد.","ok");await fetchPublic();contentPanel()}
  };

  window.updateSocial=async function(e){
    e.preventDefault();const f=new FormData(e.target);
    const {error}=await sb.from("social_links").update({url:String(f.get("url")||"").trim(),is_enabled:f.get("is_enabled")==="on"}).eq("id",f.get("id"));
    if(error)toast(error.message,"error");else{toast("لینک اجتماعی ذخیره شد.","ok");await fetchPublic();contentPanel()}
  };

  window.editItem=async function(id){
    const i=S.items.find(x=>x.id===id); if(!i)return;
    const opts="<option value=''>بدون تصویر</option>"+S.media.map(m=>"<option value='"+m.id+"' "+(m.id===i.media_id?"selected":"")+">"+esc(m.filename)+"</option>").join("");
    const modal=openEditor("ویرایش غذا", "<form id='editItemForm' class='form-grid'>"+
      "<label>نام<input name='name' value='"+esc(i.name)+"' required></label><label>نام انگلیسی<input name='name_en' value='"+esc(i.name_en)+"'></label>"+
      "<label>قیمت<input name='price' type='number' min='0' value='"+esc(i.price)+"' required></label><label>قیمت قبلی<input name='old_price' type='number' min='0' value='"+esc(i.old_price||"")+"'></label>"+
      "<label>تصویر<select name='media_id'>"+opts+"</select></label><label>ترتیب<input name='sort_order' type='number' value='"+esc(i.sort_order||100)+"'></label>"+
      "<label class='full'>توضیح<textarea name='description'>"+esc(i.description||"")+"</textarea></label><label class='full'>توضیح انگلیسی<textarea name='description_en'>"+esc(i.description_en||"")+"</textarea></label>"+
      "<label>مواد<input name='ingredients' value='"+esc(i.ingredients||"")+"'></label><label>Ingredients<input name='ingredients_en' value='"+esc(i.ingredients_en||"")+"'></label>"+
      "<label>آلرژن‌ها<input name='allergens' value='"+esc((i.allergens||[]).join(", "))+"'></label><label>برچسب‌ها<input name='tags' value='"+esc((i.tags||[]).join(", "))+"'></label>"+
      "<label class='check'><input name='is_available' type='checkbox' "+(i.is_available?"checked":"")+"> قابل سفارش</label><label class='check'><input name='is_special' type='checkbox' "+(i.is_special?"checked":"")+"> ویژه</label>"+
      "<label class='check'><input name='is_popular' type='checkbox' "+(i.is_popular?"checked":"")+"> محبوب</label><label class='check'><input name='is_new' type='checkbox' "+(i.is_new?"checked":"")+"> جدید</label>"+
      "<label class='check'><input name='is_vegetarian' type='checkbox' "+(i.is_vegetarian?"checked":"")+"> گیاهی</label><label class='check'><input name='is_vegan' type='checkbox' "+(i.is_vegan?"checked":"")+"> وگان</label>"+
      "<label class='check'><input name='is_spicy' type='checkbox' "+(i.is_spicy?"checked":"")+"> تند</label><button class='btn full'>ذخیره غذا</button></form>");
    $("#editItemForm").onsubmit=async function(e){
      e.preventDefault();const f=new FormData(e.target), bool=k=>f.get(k)==="on";
      const {error}=await sb.from("menu_items").update({name:String(f.get("name")).trim(),name_en:String(f.get("name_en")||"").trim(),price:Number(f.get("price")),old_price:f.get("old_price")?Number(f.get("old_price")):null,media_id:f.get("media_id")||null,sort_order:Number(f.get("sort_order")||100),description:String(f.get("description")||""),description_en:String(f.get("description_en")||""),ingredients:String(f.get("ingredients")||""),ingredients_en:String(f.get("ingredients_en")||""),allergens:String(f.get("allergens")||"").split(",").map(x=>x.trim()).filter(Boolean),tags:String(f.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean),is_available:bool("is_available"),is_special:bool("is_special"),is_popular:bool("is_popular"),is_new:bool("is_new"),is_vegetarian:bool("is_vegetarian"),is_vegan:bool("is_vegan"),is_spicy:bool("is_spicy")}).eq("id",id);
      if(error)toast(error.message,"error");else{closeEditor();toast("غذا کامل بروزرسانی شد.","ok");await fetchPublic();renderAdmin()}
    };
    return modal;
  };

  window.editCat=async function(id){
    const c=S.cats.find(x=>x.id===id); if(!c)return;const opts="<option value=''>بدون تصویر</option>"+S.media.map(m=>"<option value='"+m.id+"' "+(m.id===c.media_id?"selected":"")+">"+esc(m.filename)+"</option>").join("");
    openEditor("ویرایش دسته", "<form id='editCatForm' class='form-grid'><label>نام<input name='name' value='"+esc(c.name)+"' required></label><label>نام انگلیسی<input name='name_en' value='"+esc(c.name_en)+"'></label><label>آیکن<input name='icon' value='"+esc(c.icon||"✦")+"'></label><label>تصویر<select name='media_id'>"+opts+"</select></label><label class='full'>توضیح<textarea name='description'>"+esc(c.description||"")+"</textarea></label><label class='check'><input name='is_active' type='checkbox' "+(c.is_active?"checked":"")+"> فعال</label><button class='btn full'>ذخیره دسته</button></form>");
    $("#editCatForm").onsubmit=async function(e){e.preventDefault();const f=new FormData(e.target);const {error}=await sb.from("menu_categories").update({name:String(f.get("name")).trim(),name_en:String(f.get("name_en")||"").trim(),icon:String(f.get("icon")||"✦"),media_id:f.get("media_id")||null,description:String(f.get("description")||""),is_active:f.get("is_active")==="on"}).eq("id",id);if(error)toast(error.message,"error");else{closeEditor();toast("دسته بروزرسانی شد.","ok");await fetchPublic();renderAdmin()}}
  };

  window.openEditor=function(title,body){
    closeEditor();
    const div=document.createElement("div");div.id="editModal";div.className="modal open";div.innerHTML="<div class='modal-box'><div class='modal-head'><div><div class='eyebrow'>NOIR · EDITOR</div><h2>"+esc(title)+"</h2></div><button type='button' class='iconbtn' onclick='closeEditor()'>×</button></div><div style='margin-top:18px'>"+body+"</div></div>";
    document.body.appendChild(div);return div;
  };
  window.closeEditor=function(){$("#editModal")?.remove()};

  window.themePanel=async function(){
    const t=S.theme;
    $("#adminPanel").innerHTML="<div class='card'><h2>تم و ظاهر</h2><form id='themeForm' class='form-grid'>"+
    "<div class='color-row full'><label>رنگ اصلی<input name='primary_color' type='color' value='"+esc(t.primary_color||"#d6b978")+"'></label><label>رنگ مکمل<input name='accent_color' type='color' value='"+esc(t.accent_color||"#f2dfad")+"'></label></div>"+
    "<label>پس‌زمینه تیره<input name='dark_background' value='"+esc(t.dark_background)+"'></label><label>سطح تیره<input name='dark_surface' value='"+esc(t.dark_surface)+"'></label><label>متن تیره<input name='dark_text' value='"+esc(t.dark_text)+"'></label><label>متن کم‌رنگ<input name='muted_text' value='"+esc(t.muted_text)+"'></label>"+
    "<label>پس‌زمینه روشن<input name='light_background' value='"+esc(t.light_background||"#f4efe4")+"'></label><label>سطح روشن<input name='light_surface' value='"+esc(t.light_surface||"#fffaf1")+"'></label><label>متن روشن<input name='light_text' value='"+esc(t.light_text||"#1b1a16")+"'></label>"+
    "<label>فونت<input name='font_family' value='"+esc(t.font_family||"Vazirmatn, sans-serif")+"'></label><label>شعاع<input name='radius_px' type='number' min='4' max='40' value='"+esc(t.radius_px||20)+"'></label><label>شدت سایه<input name='shadow_strength' type='number' min='0' max='1' step='.05' value='"+esc(t.shadow_strength||".22")+"'></label>"+
    "<label>حالت پیش‌فرض<select name='default_mode'><option value='dark' "+(t.default_mode==="dark"?"selected":"")+">Dark</option><option value='light' "+(t.default_mode==="light"?"selected":"")+">Light</option></select></label><button class='btn full'>ذخیره تم</button></form></div>";
    $("#themeForm").onsubmit=async function(e){e.preventDefault();const f=new FormData(e.target),p={primary_color:f.get("primary_color"),accent_color:f.get("accent_color"),dark_background:f.get("dark_background"),dark_surface:f.get("dark_surface"),dark_text:f.get("dark_text"),muted_text:f.get("muted_text"),light_background:f.get("light_background"),light_surface:f.get("light_surface"),light_text:f.get("light_text"),font_family:f.get("font_family"),radius_px:Number(f.get("radius_px")),shadow_strength:Number(f.get("shadow_strength")),default_mode:f.get("default_mode")};const {error}=await sb.from("theme_settings").update(p).eq("id","00000000-0000-0000-0000-000000000002");if(error)toast(error.message,"error");else{toast("تم ذخیره شد.","ok");await fetchPublic();renderAdmin()}}
  };

  window.dashboardPanel=async function(){
    const [a,b,c,d,e,f,g]=await Promise.all([
      sb.from("menu_items").select("id",{count:"exact",head:true}).is("deleted_at",null),
      sb.from("menu_categories").select("id",{count:"exact",head:true}).is("deleted_at",null),
      sb.from("reservations").select("id",{count:"exact",head:true}).eq("status","pending"),
      sb.from("media").select("id",{count:"exact",head:true}).is("deleted_at",null),
      sb.from("special_offers").select("id",{count:"exact",head:true}).eq("is_active",true),
      sb.from("analytics_events").select("*").gte("created_at",new Date(Date.now()-30*864e5).toISOString()),
      canSuper()?sb.from("audit_logs").select("*").order("created_at",{ascending:false}).limit(6):Promise.resolve({data:[]})
    ]);
    const events=f.data||[], views=events.filter(x=>x.event_type==="page_view").length, menuViews=events.filter(x=>x.event_type==="menu_view").length;
    $("#adminPanel").innerHTML="<div class='metric-grid'><div class='card metric'><strong>"+(a.count||0)+"</strong><span class='muted'>غذا</span></div><div class='card metric'><strong>"+(b.count||0)+"</strong><span class='muted'>دسته</span></div><div class='card metric'><strong>"+(c.count||0)+"</strong><span class='muted'>رزرو در انتظار</span></div><div class='card metric'><strong>"+(d.count||0)+"</strong><span class='muted'>تصویر</span></div></div>"+
    "<div class='grid two' style='margin-top:15px'><div class='card'><div class='eyebrow'>LAST 30 DAYS</div><h2>تحلیل بازدید</h2><div class='stat-line'><span>بازدید صفحات</span><strong>"+views+"</strong></div><div class='stat-line'><span>بازدید منو</span><strong>"+menuViews+"</strong></div><div class='stat-line'><span>درخواست رزرو</span><strong>"+events.filter(x=>x.event_type==="reservation_submit").length+"</strong></div></div><div class='card'><div class='eyebrow'>SYSTEM</div><h2>وضعیت سیستم</h2><div class='stat-line'><span>Database</span><strong>Supabase</strong></div><div class='stat-line'><span>Storage</span><strong>Supabase Storage</strong></div><div class='stat-line'><span>Hosting</span><strong>GitHub Pages</strong></div><div class='stat-line'><span>پیشنهاد فعال</span><strong>"+(e.count||0)+"</strong></div></div></div>"+
    (canSuper()?"<div class='card' style='margin-top:15px'><h2>آخرین تغییرات</h2><div class='table-wrap'><table class='table'><tr><th>زمان</th><th>عملیات</th><th>بخش</th></tr>"+(g.data||[]).map(x=>"<tr><td>"+dateFa(x.created_at)+"</td><td>"+esc(x.action)+"</td><td>"+esc(x.entity_type)+"</td></tr>").join("")+"</table></div></div>":"");
  };
})();
