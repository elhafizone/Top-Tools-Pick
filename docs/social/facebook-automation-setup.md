# إعداد أتمتة النشر التلقائي على فيسبوك (بدون طرف ثالث)
# Facebook First-Party Automated Publishing Setup

تم بناء نظام أتمتة النشر لصفحة **Top Tools Pick** بالكامل **كود محلي داخلي (First-Party)** يعتمد مباشرة على **Meta Graph API الرسمية**، بدون أي منصة طرف ثالث (لا يوجد اشتراك في Buffer أو Zapier أو Make أو Publer).

---

## 1. ما تم إنجازه وضبطه على صفحة فيسبوك مباشرة:
- **رابط سياسة الخصوصية:** تمت إضافته وتفعيله رسميًا في `About > Privacy and legal info` مشيرًا إلى:
  `https://toptoolspick.com/privacy`
- **حساب التواصل الاجتماعي (X / Twitter):** تم ربطه في قسم الروابط ليظهر مباشرة في معلومات الصفحة:
  `https://x.com/toptoolspick`
- **المنشور الافتتاحي الأول (Welcome Pillar Post):**
  - تم نشره بنجاح ومرفق معه كارت المعاينة الذكي لموقع TopToolsPick بالصورة الرسمية والوصف.
  - تم تثبيت المنشور في أعلى الصفحة (**Pin to top**) ليكون واجهة لكل الزوار الجدد.

---

## 2. هيكلة نظام الأتمتة المبرمج في المشروع:

1. **المكتبة المركزية (`lib/social/facebook.ts`):**
   - ترسل طلبات HTTP مباشرة عبر `fetch` إلى `https://graph.facebook.com/v19.0/{PAGE_ID}/feed`.
   - لا تتطلب أي مكتبات خارجية إضافية أو طرف ثالث.
   - تقوم باختيار المقالات المنشورة دورياً وتصيغ محتوى تسويقي احترافي بالهاشتاغات ورابط المقال المباشر.
   - تسجل عمليات النشر في جدول الأوديت (`AuditLog`) لضمان عدم تكرار نشر نفس المقال مرتين.

2. **نقطة الـ API المجدولة (`app/api/cron/facebook-publish/route.ts`):**
   - محمية بكلمة سر المشرف الموحدة `CRON_SECRET`.
   - يتم طلبها دورياً من خلال سيرفر الاستضافة (Hostinger Cron).

3. **سكريبت التشغيل اليدوي (`scripts/publish-to-facebook.ts`):**
   - لاختبار النشر الفوري لأحدث مقال أو مقال محدد عبر سطر الأوامر:
     ```bash
     npx tsx --env-file=.env.local scripts/publish-to-facebook.ts
     ```

---

## 3. الخطوات البسيطة لتفعيل النشر التلقائي (الحصول على Access Token):

لكي يتمكن الكود من النشر نيابة عن الصفحة مباشرة عبر فيسبوك، يحتاج إلى مفتاح وصول خاص بالصفحة (**Page Access Token**):

1. **الدخول إلى بوابة مطوري ميتا:**
   - توجه إلى: [developers.facebook.com](https://developers.facebook.com/) وسجل دخولك بنفس حساب فيسبوك.
   - اضغط **Create App** (نوع التطبيق: **Other** ثم اختر **Business** أو **None**).
   - سمّ التطبيق مثلاً: `TopToolsPick AutoPublisher`.

2. **توليد مفتاح الصفحة (Page Access Token):**
   - توجه إلى أداة مستكشف الواجهة: [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
   - في خانة **Meta App** اختر تطبيقك `TopToolsPick AutoPublisher`.
   - في خانة **User or Page** اختر صفحتك: **Top Tools Pick**.
   - في خانة الصلاحيات (**Permissions**) أضف الصلاحيتين التاليتين:
     - `pages_manage_posts`
     - `pages_read_engagement`
   - اضغط **Generate Access Token** ثم امنح الموافقة.

3. **الحصول على توكن دائم لا ينتهي (Never-expiring Token):**
   - الصق التوكن في أداة [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/).
   - اضغط **Extend Access Token** لتحويله إلى توكن صفحة دائم.

4. **إضافة المتغيرات:**
   في ملف `.env.local` ولوحة تحكم الاستضافة في Hostinger (Environment Variables)، أضف:
   ```env
   FACEBOOK_PAGE_ID="61596248311349"
   FACEBOOK_PAGE_ACCESS_TOKEN="EAA..."
   ```

---

## 4. جدولة النشر يومياً على استضافة Hostinger:

في لوحة تحكم **Hostinger hPanel**:
1. اذهب إلى **Advanced** > **Cron Jobs**.
2. اختر نوع الجدولة: **Custom** (مثلاً يومياً الساعة 12:00 ظهراً):
   - الدقيقة: `0`
   - الساعة: `12`
   - باقي الحقول: `*`
3. في خانة الأمر (**Command**)، اكتب:
   ```bash
   curl -s "https://toptoolspick.com/api/cron/facebook-publish?secret=YOUR_CRON_SECRET"
   ```
   *(استبدل `YOUR_CRON_SECRET` بنفس القيمة الموجودة لديك في المتغيرات)*

بذلك، يقوم سيرفرك كل يوم في الموعد المحدد بالنشر مباشرة على فيسبوك تلقائياً وبدون أي وسيط خارجي إطلاقاً!
