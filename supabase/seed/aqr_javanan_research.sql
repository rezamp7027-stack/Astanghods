-- Research-backed archive seed for the Astan Quds Razavi Youth Institute.
-- Requires migration 20261005105207_research_provenance_and_historical_content.sql.
-- Historical records are intentionally marked as such and never treated as live registration inventory.

insert into public.organizations(name,slug,organization_type,city,website,description,is_active)
values (
  'مؤسسه جوانان آستان قدس رضوی',
  'moassese-javanan-astan-qods-razavi',
  'youth_institute',
  'مشهد',
  'https://javanan.org',
  'مجموعه فعال در حوزه تربیت، آموزش و فعالیت‌های فرهنگی و اجتماعی جوانان و نوجوانان.',
  true
)
on conflict(slug) do update set
  website=excluded.website,
  description=excluded.description,
  is_active=excluded.is_active,
  updated_at=now();

insert into public.research_sources(title,url,source_type,confidence,notes,metadata)
values
('کانال رسمی مؤسسه جوانان آستان قدس رضوی','https://t.me/aqr_javanan','official_telegram','high','مرجع رسمی اطلاع‌رسانی و آرشیو عمومی مؤسسه.','{"handle":"@aqr_javanan"}'),
('کانال رسمی مرکز آموزش مؤسسه جوانان','https://t.me/edu_javanan','official_telegram','high','مرجع رسمی دوره‌ها و اطلاعیه‌های مرکز آموزش.','{"handle":"@edu_javanan"}'),
('وب‌سایت رسمی مؤسسه جوانان','https://javanan.org','official_website','high','مرجع وبی عمومی و آرشیو محتوایی مؤسسه.','{}'),
('وب‌سایت مرکز آموزش','https://edu.javanan.org','official_education_portal','high','درگاه آموزش و معرفی دوره‌های مرکز آموزش.','{}'),
('سامانه معارف کاربردی برهان','https://borhan.javanan.org/maaref','official_education_portal','high','صفحه رسمی دوره معارف کاربردی برهان.','{"course":"معارف کاربردی برهان"}'),
('سامانه بی‌نهایت','https://dn.javanan.org','official_education_portal','high','سامانه رسمی مرتبط با بی‌نهایت.','{"course":"بی‌نهایت"}'),
('آرشیو رسمی برنامه‌های مؤسسه','https://t.me/s/aqr_javanan?before=1376','official_telegram_archive','high','گزارش تاریخی اردوگاه، مجتمع دانشجویی و فعالیت‌های فرهنگی.','{"archive_cursor":"1376"}'),
('آرشیو رسمی هیئت‌های نوجوانان','https://t.me/s/aqr_javanan?before=1077','official_telegram_archive','high','گزارش فعالیت‌های شباب الشمس و برنامه‌های نوجوانان.','{"archive_cursor":"1077"}'),
('آرشیو رسمی بزم اندیشه','https://t.me/s/aqr_javanan?before=1192','official_telegram_archive','high','گزارش نشست‌های بزم اندیشه و برخی تولیدات محتوایی.','{"archive_cursor":"1192"}'),
('آرشیو رسمی تربیت استاد عقاید','https://t.me/s/aqr_javanan?before=1227','official_telegram_archive','high','گزارش دوره تربیت استاد عقاید اسلامی.','{"archive_cursor":"1227"}'),
('آرشیو تولیدات کتابی','https://telegram.me/s/Aqr_javanan?before=3486','official_telegram_archive','medium','گزارش تولید و معرفی آثار کتابی.','{"archive_cursor":"3486"}'),
('آرشیو نشست‌های تحلیلی','https://telegram.me/s/Aqr_javanan?before=3445','official_telegram_archive','high','آرشیو نشست‌های تحلیلی از جمله معمای شرم‌الشیخ.','{"archive_cursor":"3445"}'),
('آرشیو خدمات محرم و موکب‌ها','https://t.me/s/aqr_javanan/3009','official_telegram_archive','high','گزارش خدمات محرم، موکب حضرت نجمه و آمار خدمت‌رسانی.','{"post_id":"3009"}'),
('فهرست رسمی کانال‌های پیام‌رسان','https://t.me/s/aqr_javanan','official_telegram','high','مرجع عمومی مسیرهای رسمی اطلاع‌رسانی.','{}')
on conflict(url) do update set
  title=excluded.title,
  source_type=excluded.source_type,
  confidence=excluded.confidence,
  notes=excluded.notes,
  metadata=excluded.metadata,
  updated_at=now();

insert into public.programs(
  title,slug,summary,description,status,program_type,
  audience_min_age,audience_max_age,location_name,city,published_at,
  is_historical,source_url,source_type,source_confidence
)
values
('بزم اندیشه','bazm-andisheh','سلسله نشست‌های تحلیلی و ایده‌پردازی با محور مسائل فکری، فرهنگی و اجتماعی.','آرشیو رسمی مؤسسه چهار نشست تحلیلی و ایده‌پردازی پیرامون گام دوم انقلاب را ثبت کرده است.','completed','discussion',15,35,'مجتمع دانشجویی امام رضا(ع)','مشهد','2019-03-11T00:00:00+03:30',true,'https://t.me/s/aqr_javanan?before=1192','official social archive','high'),
('تربیت استاد عقاید اسلامی','borhan-tarbiyat-ostad-aqaed','دوره کشوری تربیت استاد عقاید اسلامی برای توانمندسازی طلاب در تبیین عقاید و پاسخ به شبهات.','گزارش رسمی از بیش از ۱۰۰۰ داوطلب، ۱۷۰ منتخب، بیش از ۱۰۰ ساعت آموزش و برگزاری دوره در مشهد خبر می‌دهد.','completed','train-the-trainer',18,60,null,null,'2018-12-31T20:30:00+00',true,'https://t.me/s/aqr_javanan?before=1227','official social archive','high'),
('باشگاه مجازی نوجوانان رفیق','rafiq-virtual-youth-club','باشگاه مجازی نوجوانان.','آرشیو رسمی اجرای مراحل و مأموریت‌های باشگاه مجازی نوجوانان را ثبت کرده است.','completed','youth_club',12,18,null,null,null,true,'https://t.me/s/aqr_javanan?before=1077','official social archive','medium'),
('هیئت نوجوانان شباب الشمس','shabab-al-shams-youth-heyat','هیئت نوجوانان شباب الشمس با محور برنامه‌های فرهنگی و مناسبتی.','آرشیو رسمی از افتتاح هیئت و برنامه‌هایی با حضور صدها نوجوان مشهدی خبر می‌دهد.','completed','youth_cultural',12,18,null,'مشهد',null,true,'https://t.me/s/aqr_javanan?before=1077','official social archive','high'),
('بی‌نهایت','bi-nihayat','دوره مجازی ویژه نوجوانان با محور پرسش‌های بنیادین و تربیت معرفتی.','دوره چهارم در اطلاع‌رسانی مرکز آموزش، متولدین ۱۳۸۱ تا ۱۳۸۵ را مخاطب اعلام کرده است.','completed','online_youth',12,18,null,null,null,true,'https://t.me/s/edu_javanan?before=23','official education channel','high'),
('سدید','sadid','دوره مجازی توانمندسازی مهارتی و معرفتی فعالان فرهنگی و اجتماعی.','گزارش مرکز آموزش از ۴۰ ساعت آموزش تصویری در موضوعاتی مانند کار تیمی، خودسازی و جامعه‌سازی، روایت در رسانه، تربیت تشکیلاتی و هم‌افزایی تشکل‌ها خبر می‌دهد.','completed','online_training',18,45,null,null,null,true,'https://t.me/s/edu_javanan','official education channel','high'),
('معارف کاربردی برهان','borhan-maaref-karbordi','دوره مقدماتی معارف اسلامی برای دانشجویان، طلاب و علاقه‌مندان.','۱۰ ساعت محتوای ویدیویی در پنج محور معرفت‌شناسی، انسان‌شناسی و جهان‌شناسی، خداشناسی، راهنماشناسی و معادشناسی.','completed','online_training',18,60,null,null,null,true,'https://t.me/s/edu_javanan','official education channel','high'),
('تربیت مربی معارفی برهان','borhan-morabi','دوره جامع تربیت مربی معارفی.','دوره مجازی با استادان ملی، ارزیابی، گواهینامه و مسیر پیوستن منتخبین به شبکه مربیان.','completed','train-the-trainer',18,60,null,null,null,true,'https://t.me/s/edu_javanan','official education channel','high'),
('ضد','zedd-national-course','دوره ملی و مجازی برای توانمندسازی در تعامل با مخاطبان پرچالش نوجوان و جوان.','گزارش رسمی از دوره تبیینی ملی «ضد» با حدود ۲۵ ساعت محتوای ویدیویی و ۱۹ هزار دانش‌پژوه در اولین دوره منتشر شده است.','completed','online_training',15,30,null,null,null,true,'https://t.me/s/edu_javanan','official education channel','high'),
('هفت روز در بهشت','haft-rooz-behesht','اردوهای آموزشی معرفتی ویژه دانش‌آموزان نخبه سراسر کشور.','برنامه چندروزه با ترکیبی از آموزش، فعالیت فرهنگی، زیارتی و اردویی که در گزارش رسمی حضور ۳۰۰ دانش‌آموز نیز ذکر شده است.','completed','camp',13,18,null,'مشهد',null,true,'https://t.me/s/aqr_javanan','official social archive','high'),
('تربیت مربی تخصصی جوان و نوجوان','specialist-youth-trainer','دوره کشوری تربیت مربی تخصصی جوان و نوجوان.','آرشیو رسمی ثبت‌نام، مصاحبه و برگزاری دوره کشوری تربیت مربی جوان و نوجوان را گزارش کرده است.','completed','train-the-trainer',18,45,null,null,null,true,'https://t.me/s/aqr_javanan','official social archive','high'),
('مدرسه فکری علامه طباطبایی','allameh-tabatabaei-thought-school','مسیر فکری و آموزشی برای بررسی آراء و اندیشه‌های علامه طباطبایی.','برنامه‌ای فکری با حضور استادان حوزه و دانشگاه که در اطلاع‌رسانی رسمی مؤسسه ثبت شده است.','completed','thought_school',18,60,null,'مشهد',null,true,'https://t.me/s/aqr_javanan','official social archive','high')
on conflict(slug) do update set
  summary=excluded.summary,
  description=excluded.description,
  status=excluded.status,
  program_type=excluded.program_type,
  audience_min_age=excluded.audience_min_age,
  audience_max_age=excluded.audience_max_age,
  location_name=excluded.location_name,
  city=excluded.city,
  published_at=excluded.published_at,
  is_historical=excluded.is_historical,
  source_url=excluded.source_url,
  source_type=excluded.source_type,
  source_confidence=excluded.source_confidence,
  updated_at=now();

insert into public.courses(title,slug,summary,description,is_published,is_historical,source_url,source_type,source_confidence)
values
('بزم اندیشه','course-bazm-andisheh','مطالعه و گفت‌وگوی تحلیلی پیرامون مسائل فکری و اجتماعی جوانان.','مسیر آموزشی آرشیوی بر پایه نشست‌های تاریخی بزم اندیشه.',true,true,'https://t.me/s/aqr_javanan?before=1192','official social archive','high'),
('تربیت استاد عقاید اسلامی','course-borhan-aqaed','معرفت‌شناسی، انسان‌شناسی، خداشناسی، معادشناسی، اسلام‌شناسی، شیعه‌شناسی، روش تدریس عقاید و مهارت مطالعه.','رکورد آرشیوی دوره سوم کشوری تربیت استاد عقاید اسلامی.',true,true,'https://t.me/s/aqr_javanan?before=1227','official social archive','high'),
('بی‌نهایت','course-bi-nihayat','دوره مجازی نوجوانان برای پاسخ به پرسش‌های بنیادین.','رکورد آرشیوی دوره بی‌نهایت.',true,true,'https://t.me/s/edu_javanan?before=23','official education channel','high'),
('تربیت مربی معارفی برهان','course-borhan-morabi','تربیت مربی معارفی با مسیر ارزیابی و شبکه مربیان.','رکورد آرشیوی دوره‌های برهان.',true,true,'https://t.me/s/edu_javanan','official education channel','high'),
('توکل','course-tavakkol','دوره کوتاه معرفتی درباره توکل.','۳ ساعت در ۱۶ جلسه طبق معرفی مرکز آموزش.',true,true,'https://t.me/s/edu_javanan','official education channel','high'),
('سدید','course-sadid','توانمندسازی مهارتی و معرفتی فعالان فرهنگی و اجتماعی.','۴۰ ساعت آموزش تصویری در بستر آموزش مجازی.',true,true,'https://t.me/s/edu_javanan','official education channel','high'),
('ضد','course-zedd','دوره ملی تبیینی برای نوجوانان و جوانان.','رکورد آرشیوی دوره ۲۵ ساعته ضد.',true,true,'https://t.me/s/edu_javanan','official education channel','high'),
('فلسفه مقدماتی','course-philosophy-intro','دوره مقدماتی فلسفه.','۱۷ ساعت در ۲۶ جلسه طبق معرفی مرکز آموزش.',true,true,'https://t.me/s/edu_javanan','official education channel','high'),
('مدرسه فکری علامه طباطبایی','course-allameh-tabatabaei','بررسی آراء و اندیشه‌های علامه طباطبایی.','مسیر فکری آرشیوی بر اساس برنامه رسمی مؤسسه.',true,true,'https://t.me/s/aqr_javanan','official social archive','high'),
('معارف کاربردی برهان','course-borhan-maaref','دوره مقدماتی معارف اسلامی در پنج محور.','۱۰ ساعت محتوای ویدیویی بر اساس معرفی مرکز آموزش.',true,true,'https://t.me/s/edu_javanan','official education channel','high'),
('منطق مقدماتی','course-logic-intro','دوره مقدماتی منطق.','۱۴ ساعت در ۳۶ جلسه طبق معرفی مرکز آموزش.',true,true,'https://t.me/s/edu_javanan','official education channel','high')
on conflict(slug) do update set
  summary=excluded.summary,
  description=excluded.description,
  is_published=excluded.is_published,
  is_historical=excluded.is_historical,
  source_url=excluded.source_url,
  source_type=excluded.source_type,
  source_confidence=excluded.source_confidence,
  updated_at=now();

insert into public.events(title,slug,summary,description,starts_at,venue_name,city,is_public)
values
('نشست اول بزم اندیشه: تحلیل و ایده‌پردازی گام دوم انقلاب','bazm-andisheh-1-gam2','نشست اول سلسله نشست‌های بزم اندیشه.','برگزاری در مجتمع دانشجویی امام رضا(ع) با حضور فعالان رسانه‌ای، اجتماعی و فکری.','2019-02-27T15:00:00+03:30','مجتمع دانشجویی امام رضا(ع)','مشهد',true),
('نشست دوم بزم اندیشه: تحلیل و ایده‌پردازی گام دوم انقلاب','bazm-andisheh-2-gam2','نشست دوم سلسله نشست‌های بزم اندیشه.','با حضور مرتضی سعیدی‌زاده، علی سهیلی، میثم ظهوریان و جلیل معماریانی.','2019-03-04T15:00:00+03:30','مجتمع دانشجویی امام رضا(ع)','مشهد',true),
('نشست سوم بزم اندیشه: تحلیل و ایده‌پردازی گام دوم انقلاب','bazm-andisheh-3-gam2','نشست سوم سلسله نشست‌های بزم اندیشه.','با حضور دکتر معینی‌پور، دکتر علی باقری و استاد شجاعی.','2019-03-06T17:30:00+03:30','مجتمع دانشجویی امام رضا(ع)','مشهد',true),
('نشست چهارم بزم اندیشه: انقلابی دیروز؛ انقلابی فردا','bazm-andisheh-4-gam2','نشست چهارم بزم اندیشه.','با حضور محمدصادق شهبازی، دکتر میلاد دخانچی و جواد موگویی.','2019-03-11T15:00:00+03:30','مجتمع دانشجویی امام رضا(ع)','مشهد',true)
on conflict(slug) do update set
  summary=excluded.summary,
  description=excluded.description,
  starts_at=excluded.starts_at,
  venue_name=excluded.venue_name,
  city=excluded.city,
  is_public=excluded.is_public,
  updated_at=now();

insert into public.content(
  title,slug,summary,body,content_type,status,published_at,
  is_historical,source_url,source_type,source_confidence,source_published_at,tags
)
values
('بزم اندیشه؛ تحلیل و ایده‌پردازی گام دوم انقلاب','article-bazm-andisheh-gam2','آرشیو چهار نشست تحلیلی و ایده‌پردازی گام دوم انقلاب در سال ۱۳۹۷.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1192","confidence":"high","tags":["بزم اندیشه","گام دوم انقلاب","جوانان"]}',
 'article','published','2019-03-11T00:00:00+03:30',true,'https://t.me/s/aqr_javanan?before=1192','official social archive','high','2019-03-11',array['بزم اندیشه','گام دوم انقلاب','جوانان']),
('سومین دوره کشوری تربیت استاد عقاید اسلامی','article-borhan-third-course','گزارش سومین دوره کشوری تربیت استاد عقاید اسلامی با حضور ۱۷۰ طلبه.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1227","confidence":"high","statistics":{"applicants":1000,"selected":170,"men":130,"women":40,"hours":100,"days":10}}',
 'article','published','2018-12-31T20:30:00+00',true,'https://t.me/s/aqr_javanan?before=1227','official social archive','high','2018-12-31',array['برهان','تربیت مربی','عقاید اسلامی']),
('تولید بیش از ۷۰ عنوان کتاب معارفی','article-70-maarefi-books','گزارش طراحی نظام جامع محتوایی و انتشار بیش از ۷۰ عنوان کتاب معارفی.',
 '{"source_url":"https://telegram.me/s/Aqr_javanan?before=3486","confidence":"medium","reported_book_titles":["حکایت جنسیت","روح نماز ۲","چیستا ۱","چیستا ۲","اخلاص","اشک","در مدار تو"]}',
 'article','published','2019-12-31T20:30:00+00',true,'https://telegram.me/s/Aqr_javanan?before=3486','official social archive','medium','2019-12-31',array['کتاب','تولید محتوا','معارف']),
('رمان دعبل و زلفا','article-daabal-zolfa','رمانی که به همت مؤسسه جوانان تولید و با همکاری مؤسسه به‌نشر منتشر شده است.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1192","confidence":"high","reported_edition":40}',
 'article','published','2019-12-31T20:30:00+00',true,'https://t.me/s/aqr_javanan?before=1192','official social archive','high','2019-12-31',array['کتاب','دعبل و زلفا','فرهنگ']),
('هیئت نوجوانان شباب الشمس','article-shabab-shams','گزارش فعالیت هیئت نوجوانان شباب الشمس.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1077","confidence":"high","reported_attendance":"صدها نوجوان پسر"}',
 'article','published','2019-12-31T20:30:00+00',true,'https://t.me/s/aqr_javanan?before=1077','official social archive','high','2019-12-31',array['شباب الشمس','نوجوانان','هیئت']),
('نشست تحلیلی معمای شرم‌الشیخ','article-sharm-el-sheikh','نشست تحلیلی از سلسله نشست‌های بزم اندیشه.',
 '{"source_url":"https://telegram.me/s/Aqr_javanan?before=3445","confidence":"high","speaker":"مسعود اسداللهی"}',
 'article','published',null,true,'https://telegram.me/s/Aqr_javanan?before=3445','official social archive','high',null,array['بزم اندیشه','نشست تحلیلی']),
('پذیرش ۹۰۰ دانشجو و بیش از ۱۰۰۰ جوان و نوجوان','article-weekly-report-student-youth','بخشی از گزارش هفتگی فعالیت‌های مؤسسه.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1227","confidence":"high","note":"این اعداد مربوط به همان بازه گزارش هستند و آمار جاری یا سالانه نیستند.","students":900,"youth_and_teenagers":1000}',
 'report','published','2018-12-31T20:30:00+00',true,'https://t.me/s/aqr_javanan?before=1227','official social archive','high','2018-12-31',array['گزارش عملکرد','پذیرش','دانشجویان']),
('شبکه اطلاع‌رسانی مؤسسه جوانان','article-official-channels','اطلاعات تماس و مسیرهای عمومی ثبت‌شده برای مؤسسه.',
 '{"source_url":"https://t.me/aqr_javanan","confidence":"high","website":"https://javanan.org","sms":"1000888","phone":"05138460085"}',
 'article','published',null,true,'https://t.me/aqr_javanan','official social archive','high',null,array['اطلاع‌رسانی','تماس','رسانه']),
('سامانه‌های آموزشی تعاملی مؤسسه','content-three-learning-platforms','گزارش معرفی سامانه‌های بی‌نهایت، برهان و سدید.',
 '{"source_url":"https://t.me/s/edu_javanan?before=23","confidence":"high","platforms":["بی‌نهایت","برهان","سدید"]}',
 'report','published',null,true,'https://t.me/s/edu_javanan?before=23','official education channel','high',null,array['مرکز آموزش','بی‌نهایت','برهان','سدید']),
('۲۶ دوره مجازی تخصصی مرکز آموزش','content-26-online-courses','گزارش مرکز آموزش از ۲۶ دوره تخصصی مجازی.',
 '{"source_url":"https://t.me/s/edu_javanan","confidence":"high","course_count":26,"teacher_count":22,"video_minutes":4000}',
 'report','published',null,true,'https://t.me/s/edu_javanan','official education channel','high',null,array['دوره مجازی','مرکز آموزش','مهارتی']),
('سدید؛ ۴۰ ساعت آموزش تصویری','content-sadid-40-hours','معرفی دوره سدید.',
 '{"source_url":"https://t.me/s/edu_javanan","confidence":"high","hours":40}',
 'course','published',null,true,'https://t.me/s/edu_javanan','official education channel','high',null,array['سدید','توانمندسازی','فعالان فرهنگی']),
('بی‌نهایت؛ دوره نوجوانان','content-bi-nihayat-youth','معرفی چهارمین دوره بی‌نهایت برای نوجوانان.',
 '{"source_url":"https://t.me/s/edu_javanan?before=23","confidence":"high","audience":"نوجوانان","birth_years":"1381-1385","website":"https://dn.javanan.org"}',
 'course','published',null,true,'https://t.me/s/edu_javanan?before=23','official education channel','high',null,array['بی‌نهایت','نوجوان','آموزش مجازی']),
('برهان؛ معارف کاربردی','content-borhan-maaref','معرفی دوره معارف کاربردی برهان.',
 '{"source_url":"https://t.me/s/edu_javanan","confidence":"high","hours":10,"topics":["معرفت‌شناسی","انسان‌شناسی و جهان‌شناسی","خداشناسی","راهنماشناسی","معادشناسی"],"website":"https://borhan.javanan.org/maaref"}',
 'course','published',null,true,'https://t.me/s/edu_javanan','official education channel','high',null,array['برهان','معارف کاربردی','معرفت‌شناسی']),
('اردوگاه؛ ۱۰۴۶۰ جوان و نوجوان','content-camp-10460','گزارش تاریخی از میزبانی اردوگاه فرهنگی تربیتی امام رضا.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1376","confidence":"high","reported_participants":10460,"historical":true}',
 'report','published',null,true,'https://t.me/s/aqr_javanan?before=1376','official social archive','high',null,array['اردوگاه','جوانان','نوجوانان','امام رضا']),
('مجتمع دانشجویی امام رضا','content-student-complex','گزارش فعالیت و ظرفیت‌های تاریخی مجتمع دانشجویی امام رضا.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1376","confidence":"high","opening":"1397-09-16","land_area_sqm":5000,"dorm_beds":400,"hall_capacity":400,"historical":true}',
 'report','published',null,true,'https://t.me/s/aqr_javanan?before=1376','official social archive','high',null,array['مجتمع دانشجویی','امام رضا','دانشجویان']),
('۱۴ هزار نفرساعت برنامه معرفتی','content-14k-person-hours','گزارش اجرای ۱۴ هزار نفرساعت برنامه معرفتی در ۴۷ کلاس و کارگاه.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1376","confidence":"high","person_hours":14000,"classes_workshops":47,"historical":true}',
 'report','published',null,true,'https://t.me/s/aqr_javanan?before=1376','official social archive','high',null,array['برنامه معرفتی','کلاس','کارگاه']),
('۱۲ برنامه مشارکتی دانشگاهی','content-12-university-programs','گزارش همکاری در ۱۲ برنامه مشارکتی با دانشگاه‌ها و نهاد نمایندگی رهبری در دانشگاه‌ها.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1376","confidence":"high","program_count":12,"historical":true}',
 'report','published',null,true,'https://t.me/s/aqr_javanan?before=1376','official social archive','high',null,array['دانشگاه','همکاری','شبکه']),
('میزبانی ۱۰۰۰ دانشجوی دختر و پسر از ۶ کشور','content-1000-international-students','گزارش میزبانی بیش از ۱۰۰۰ دانشجوی دختر و پسر از ۶ کشور.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1376","confidence":"high","reported_students":1000,"countries":6,"historical":true}',
 'report','published',null,true,'https://t.me/s/aqr_javanan?before=1376','official social archive','high',null,array['دانشجویان بین‌المللی','میهمانان','مشهد']),
('هیئت شباب الشمس؛ بیش از ۳۰۰ نوجوان','content-shabab-300','گزارش برگزاری جشن مبعث در هیئت شباب الشمس با حضور بیش از ۳۰۰ نوجوان مشهدی.',
 '{"source_url":"https://t.me/s/aqr_javanan?before=1077","confidence":"high","reported_attendance":300,"historical":true}',
 'event','published',null,true,'https://t.me/s/aqr_javanan?before=1077','official social archive','high',null,array['شباب الشمس','هیئت نوجوانان','نوجوان']),
('خدمات محرم مؤسسه جوانان','content-moharram-20k','گزارش تاریخی مجالس محرم با نمایشگاه کتاب، حسینیه کودکان، چایخانه، مقتل‌خوانی و مشارکت نوجوانان و جوانان.',
 '{"source_url":"https://t.me/s/aqr_javanan/3009","confidence":"high","reported_attendance":20000,"historical":true}',
 'report','published',null,true,'https://t.me/s/aqr_javanan/3009','official social archive','high',null,array['محرم','هیئت','خدمت']),
('موکب حضرت نجمه','content-mokeb-najmeh','موکب جامع دخترانه با خدمات اختصاصی بانوان.',
 '{"source_url":"https://t.me/s/aqr_javanan/3009","confidence":"high","overnight_capacity":2000,"services":["اسکان","فرهنگی","کودکان","کافه کتاب","کافه فیلم","تئاتر","مشاوره","پزشکی","خیاطی"],"historical":true}',
 'report','published',null,true,'https://t.me/s/aqr_javanan/3009','official social archive','high',null,array['موکب','دختران','خدمت','مشاوره']),
('اسکان ۲۰ هزار زائر و ۲۰۰ هزار وعده غذا','content-20000-pilgrims-200000-meals','گزارش تاریخی خدمات موکب‌های مؤسسه به زائران.',
 '{"source_url":"https://t.me/s/aqr_javanan/3009","confidence":"high","pilgrims":20000,"meals":200000,"historical":true}',
 'report','published',null,true,'https://t.me/s/aqr_javanan/3009','official social archive','high',null,array['موکب','اسکان','پذیرایی','زائر'])
on conflict(slug) do update set
  summary=excluded.summary,
  body=excluded.body,
  content_type=excluded.content_type,
  status=excluded.status,
  published_at=excluded.published_at,
  is_historical=excluded.is_historical,
  source_url=excluded.source_url,
  source_type=excluded.source_type,
  source_confidence=excluded.source_confidence,
  source_published_at=excluded.source_published_at,
  tags=excluded.tags,
  updated_at=now();

-- Ensure all research course/program records remain archives until an editor creates a verified current offering.
update public.programs set is_historical=true
where slug in (
  'bazm-andisheh','borhan-tarbiyat-ostad-aqaed','rafiq-virtual-youth-club',
  'shabab-al-shams-youth-heyat','bi-nihayat','sadid','borhan-maaref-karbordi',
  'borhan-morabi','zedd-national-course','haft-rooz-behesht',
  'specialist-youth-trainer','allameh-tabatabaei-thought-school'
);

update public.courses set is_historical=true
where slug like 'course-%';

update public.content set is_historical=true
where slug in (
  'article-bazm-andisheh-gam2','article-borhan-third-course','article-70-maarefi-books',
  'article-daabal-zolfa','article-shabab-shams','article-sharm-el-sheikh',
  'article-weekly-report-student-youth','article-official-channels',
  'content-three-learning-platforms','content-26-online-courses','content-sadid-40-hours',
  'content-bi-nihayat-youth','content-borhan-maaref','content-camp-10460',
  'content-student-complex','content-14k-person-hours','content-12-university-programs',
  'content-1000-international-students','content-shabab-300','content-moharram-20k',
  'content-mokeb-najmeh','content-20000-pilgrims-200000-meals'
);
