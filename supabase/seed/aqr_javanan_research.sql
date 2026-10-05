-- Research-backed seed data for موسسه جوانان آستان قدس رضوی
-- Sources: official public archive https://t.me/aqr_javanan and official website reference https://javanan.org
-- This seed is intentionally idempotent and stores source metadata in content.body.

insert into public.organizations(name,slug,organization_type,city,website,description,is_active)
values ('مؤسسه جوانان آستان قدس رضوی','moassese-javanan-astan-qods-razavi','youth_institute','مشهد','https://javanan.org','مؤسسه فعال در حوزه تربیت، آموزش و فعالیت‌های فرهنگی و اجتماعی جوانان و نوجوانان.',true)
on conflict(slug) do update set website=excluded.website,description=excluded.description,is_active=true;

insert into public.programs(title,slug,summary,description,status,program_type,audience_min_age,audience_max_age,location_name,city,published_at)
values
('بزم اندیشه','bazm-andisheh','سلسله نشست‌های تحلیلی و ایده‌پردازی با محور مسائل فکری، فرهنگی و اجتماعی.','آرشیو رسمی مؤسسه چهار نشست تحلیلی و ایده‌پردازی گام دوم انقلاب را ثبت کرده است.','completed','discussion',15,35,'مجتمع دانشجویی امام رضا(ع)','مشهد','2019-02-27T00:00:00+03:30'),
('تربیت استاد عقاید اسلامی','borhan-tarbiyat-ostad-aqaed','دوره کشوری تربیت استاد عقاید اسلامی برای توانمندسازی طلاب در تبیین عقاید و پاسخ به شبهات.','گزارش رسمی سومین دوره از ۱۷۰ طلبه، بیش از ۱۰۰ ساعت آموزش در ۱۰ روز و فرآیند آزمون و مصاحبه خبر می‌دهد.','completed','train-the-trainer',18,60,null,null,null),
('باشگاه مجازی نوجوانان رفیق','rafiq-virtual-youth-club','باشگاه مجازی نوجوانان.','عنوان این باشگاه در آرشیو رسمی اطلاع‌رسانی مؤسسه ثبت شده است.','completed','youth_club',12,18,null,null,null),
('هیئت نوجوانان شباب الشمس','shabab-al-shams-youth-heyat','هیئت نوجوانان شباب الشمس با محور برنامه‌های فرهنگی و مناسبتی.','آرشیو رسمی از افتتاح هیئت و برنامه‌هایی با حضور صدها نوجوان مشهدی خبر می‌دهد.','completed','youth_cultural',12,18,null,'مشهد',null)
on conflict(slug) do update set summary=excluded.summary,description=excluded.description,status=excluded.status;

insert into public.courses(title,slug,summary,description,is_published)
values
('تربیت استاد عقاید اسلامی','course-borhan-aqaed','معرفت‌شناسی، انسان‌شناسی، خداشناسی، معادشناسی، اسلام‌شناسی، شیعه‌شناسی، روش تدریس عقاید و مهارت مطالعه.','بر اساس گزارش رسمی سومین دوره کشوری تربیت استاد عقاید اسلامی.',true),
('بزم اندیشه','course-bazm-andisheh','مطالعه و گفت‌وگوی تحلیلی پیرامون مسائل فکری و اجتماعی جوانان.','ساختار قابل استفاده برای تبدیل آرشیو نشست‌های بزم اندیشه به مسیر یادگیری.',true)
on conflict(slug) do update set summary=excluded.summary,description=excluded.description,is_published=true;

insert into public.events(title,slug,summary,description,starts_at,venue_name,city,is_public)
values
('نشست اول بزم اندیشه: تحلیل و ایده‌پردازی گام دوم انقلاب','bazm-andisheh-1-gam2','نشست اول سلسله نشست‌های بزم اندیشه.','برگزاری در مجتمع دانشجویی امام رضا(ع) با حضور فعالان رسانه‌ای، اجتماعی و فکری.','2019-02-27T15:00:00+03:30','مجتمع دانشجویی امام رضا(ع)','مشهد',true),
('نشست دوم بزم اندیشه: تحلیل و ایده‌پردازی گام دوم انقلاب','bazm-andisheh-2-gam2','نشست دوم سلسله نشست‌های بزم اندیشه.','با حضور مرتضی سعیدی‌زاده، علی سهیلی، میثم ظهوریان و جلیل معماریانی.','2019-03-04T15:00:00+03:30','مجتمع دانشجویی امام رضا(ع)','مشهد',true),
('نشست سوم بزم اندیشه: تحلیل و ایده‌پردازی گام دوم انقلاب','bazm-andisheh-3-gam2','نشست سوم سلسله نشست‌های بزم اندیشه.','با حضور دکتر معینی‌پور، دکتر علی باقری و استاد شجاعی.','2019-03-06T17:30:00+03:30','مجتمع دانشجویی امام رضا(ع)','مشهد',true),
('نشست چهارم بزم اندیشه: انقلابی دیروز؛ انقلابی فردا','bazm-andisheh-4-gam2','نشست چهارم بزم اندیشه.','با حضور محمدصادق شهبازی، دکتر میلاد دخانچی و جواد موگویی.','2019-03-11T15:00:00+03:30','مجتمع دانشجویی امام رضا(ع)','مشهد',true)
on conflict(slug) do update set summary=excluded.summary,description=excluded.description,starts_at=excluded.starts_at;

insert into public.content(title,slug,summary,body,content_type,status,published_at)
values
('بزم اندیشه؛ تحلیل و ایده‌پردازی گام دوم انقلاب','article-bazm-andisheh-gam2','آرشیو چهار نشست تحلیلی و ایده‌پردازی گام دوم انقلاب در سال ۱۳۹۷.',jsonb_build_object('source_url','https://t.me/s/aqr_javanan?before=1192','source_type','official social archive','confidence','high','tags',jsonb_build_array('بزم اندیشه','گام دوم انقلاب','جوانان')),'article','published','2019-03-11T00:00:00+03:30'),
('سومین دوره کشوری تربیت استاد عقاید اسلامی','article-borhan-third-course','گزارش سومین دوره کشوری تربیت استاد عقاید اسلامی با حضور ۱۷۰ طلبه.',jsonb_build_object('source_url','https://t.me/s/aqr_javanan?before=1227','source_type','official social archive','confidence','high','statistics',jsonb_build_object('applicants',1000,'selected',170,'men',130,'women',40,'hours',100,'days',10)),'article','published',now()),
('تولید بیش از ۷۰ عنوان کتاب معارفی','article-70-maarefi-books','گزارش طراحی نظام جامع محتوایی و انتشار بیش از ۷۰ عنوان کتاب معارفی.',jsonb_build_object('source_url','https://telegram.me/s/Aqr_javanan?before=3486','source_type','official social archive','confidence','medium','reported_book_titles',jsonb_build_array('حکایت جنسیت','روح نماز ۲','چیستا ۱','چیستا ۲','اخلاص','اشک','در مدار تو')),'article','published',now()),
('رمان دعبل و زلفا','article-daabal-zolfa','رمانی که به همت مؤسسه جوانان تولید و با همکاری مؤسسه به‌نشر منتشر شده است.',jsonb_build_object('source_url','https://t.me/s/aqr_javanan?before=1192','source_type','official social archive','confidence','high','reported_edition',40),'article','published',now()),
('هیئت نوجوانان شباب الشمس','article-shabab-shams','گزارش فعالیت هیئت نوجوانان شباب الشمس.',jsonb_build_object('source_url','https://t.me/s/aqr_javanan?before=990','source_type','official social archive','confidence','high','reported_attendance','صدها نوجوان پسر'),'article','published',now()),
('نشست تحلیلی معمای شرم‌الشیخ','article-sharm-el-sheikh','نشست تحلیلی از سلسله نشست‌های بزم اندیشه.',jsonb_build_object('source_url','https://telegram.me/s/Aqr_javanan?before=3445','source_type','official social archive','confidence','high','speaker','مسعود اسداللهی'),'article','published',now()),
('پذیرش ۹۰۰ دانشجو و بیش از ۱۰۰۰ جوان و نوجوان','article-weekly-report-student-youth','بخشی از گزارش هفتگی فعالیت‌های مؤسسه.',jsonb_build_object('source_url','https://t.me/s/aqr_javanan?before=1227','source_type','official social archive','confidence','high','note','این اعداد مربوط به همان بازه گزارش هستند و آمار سالانه محسوب نمی‌شوند.','students',900,'youth_and_teenagers',1000),'report','published',now()),
('شبکه اطلاع‌رسانی مؤسسه جوانان','article-official-channels','اطلاعات تماس و نشانی‌های عمومی ثبت‌شده برای مؤسسه.',jsonb_build_object('source_url','https://www.telegram.me/aqr_javanan','source_type','official social archive','confidence','high','website','https://javanan.org','sms','1000888','phone','05138460085'),'article','published',now())
on conflict(slug) do update set summary=excluded.summary,body=excluded.body,status=excluded.status,published_at=excluded.published_at;
