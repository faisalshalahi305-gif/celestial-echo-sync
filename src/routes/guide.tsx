import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "دليل أدوات التعديل | درس كبلر" },
      { name: "description", content: "شرح كل زر وخيار في محرر الدرس: الإضافة، الترتيب، الجداول، السجل والأدوات." },
      { property: "og:title", content: "دليل أدوات التعديل" },
      { property: "og:description", content: "تعرّف على كل زر في المحرر وكيف يبدو شكله." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Guide,
});

const Btn = ({ children }: { children: ReactNode }) => (
  <span className="inline-block shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-sm font-bold">{children}</span>
);
function Item({ btn, what, preview }: { btn: ReactNode; what: string; preview?: ReactNode }) {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[180px_1fr]">
      <div>{btn}</div>
      <div className="space-y-3"><p>{what}</p>{preview && <div className="rounded-lg border border-dashed border-primary p-3 text-sm">{preview}</div>}</div>
    </div>
  );
}
function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-extrabold text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Guide() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl space-y-10 px-4 py-10 text-foreground">
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-extrabold">📖 دليل أدوات التعديل</h1>
        <p className="text-muted-foreground">اضغط «✏️ تعديل» أسفل الصفحة، ثم اضغط داخل أي جزء تبي تعدله.</p>
        <Link to="/" className="inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">↩ رجوع للتعديل</Link>
      </header>

      <Part title="الشريط العلوي">
        <Item btn={<Btn>↶ / ↷</Btn>} what="تراجع خطوة أو إعادتها. من الكيبورد: Ctrl+Z للتراجع و Ctrl+Y للإعادة." />
        <Item btn={<span className="rounded-lg bg-success px-3 py-2 text-sm font-bold text-success-foreground">✓ حفظ</span>} what="يحفظ ويقفل وضع التعديل. (الحفظ يصير تلقائي كمان مع كل تغيير)." />
        <Item btn={<span className="rounded-full bg-primary px-4 py-4 text-primary-foreground">⌨️</span>} what="الزر الدائري على اليسار: ينزّل الكيبورد في الجوال." />
      </Part>

      <Part title="الشريط العائم فوق العنصر">
        <p>لما تضغط على أي فقرة أو جدول أو صورة يظهر فوقه شريط صغير:</p>
        <div className="flex w-fit gap-1 rounded-xl border border-border bg-card p-1 text-lg"><span className="px-2">⬆️</span><span className="px-2">⬇️</span><span className="px-2">📋</span><span className="px-2">📄</span><span className="px-2">🗑️</span></div>
        <Item btn={<Btn>⬆️ ⬇️</Btn>} what="يحرك العنصر خطوة لفوق أو لتحت." />
        <Item btn={<Btn>📋</Btn>} what="تكرار: ينسخ العنصر فوراً تحته مباشرة." />
        <Item btn={<Btn>📄</Btn>} what="نسخ: يحفظ العنصر، ثم اضغط مكان ثاني واختر «📌 لصق» من تبويب ترتيب." />
        <Item btn={<Btn>🗑️</Btn>} what="حذف العنصر. لو حذفته بالغلط ترجعه من «السجل» أو ↶." />
      </Part>

      <Part title="تبويب «إضافة»">
        <p>العنصر الجديد ينضاف تحت العنصر اللي ضاغط عليه.</p>
        <Item btn={<Btn>فقرة</Btn>} what="سطر نص عادي." preview={<p>فقرة جديدة… اكتب هنا.</p>} />
        <Item btn={<Btn>عنوان فرعي</Btn>} what="عنوان صغير داخل القسم." preview={<p className="text-xl font-bold text-primary">عنوان فرعي</p>} />
        <Item btn={<Btn>مربع مميز</Btn>} what="مربع ملون لمعلومة مهمة." preview={<div className="rounded-xl border-2 border-primary bg-accent p-3 text-accent-foreground"><b>عنوان مميز</b><p>معلومة مهمة هنا.</p></div>} />
        <Item btn={<Btn>تنبيه</Btn>} what="صندوق تحذير بخط أحمر." preview={<div className="rounded-xl border-r-8 border-destructive bg-card p-3"><b className="text-destructive">⚠️ تنبيه</b><p>اكتب التنبيه هنا.</p></div>} />
        <Item btn={<Btn>بطاقات معلومات</Btn>} what="ثلاث بطاقات جنب بعض." preview={<div className="grid grid-cols-3 gap-2">{["🪐", "☀️", "🌍"].map((e) => <div key={e} className="rounded-lg border border-border p-2 text-center">{e}<p className="font-bold text-primary">بطاقة</p></div>)}</div>} />
        <Item btn={<Btn>مقارنة</Btn>} what="عمودين للمقارنة بين شيئين." preview={<div className="grid grid-cols-2 gap-2"><div className="rounded-lg border-2 border-primary p-2 font-bold">الجانب الأول</div><div className="rounded-lg border-2 border-border p-2 font-bold">الجانب الثاني</div></div>} />
        <Item btn={<Btn>جدول</Btn>} what="جدول 3 أعمدة تكتب فيه مباشرة." preview={<table className="w-full border-collapse text-center"><thead><tr>{[1, 2, 3].map((n) => <th key={n} className="border border-border bg-primary p-1 text-primary-foreground">عمود {n}</th>)}</tr></thead><tbody><tr>{[1, 2, 3].map((n) => <td key={n} className="border border-border p-1">—</td>)}</tr></tbody></table>} />
        <Item btn={<Btn>سؤال وجواب</Btn>} what="سؤال والإجابة مخفية تظهر بزر." preview={<div className="flex justify-between rounded-lg border border-border p-2"><b>اكتب السؤال هنا؟</b><span className="rounded bg-primary px-3 text-primary-foreground">الإجابة</span></div>} />
        <Item btn={<Btn>معادلة</Btn>} what="مربع كبير للمعادلات." preview={<div dir="ltr" className="rounded-lg border-2 border-primary bg-accent py-2 text-center font-mono text-xl font-bold text-accent-foreground">F = m · a</div>} />
        <Item btn={<Btn>قائمة</Btn>} what="نقاط مرتبة." preview={<ul className="list-disc pr-6"><li>نقطة أولى</li><li>نقطة ثانية</li></ul>} />
        <Item btn={<Btn>صورة / صورة مع شرح</Btn>} what="يفتح لك اختيار صورة من جهازك. اضغط على أي صورة لاحقاً لتغييرها." preview={<div><div className="flex h-24 items-center justify-center rounded-xl bg-muted text-3xl">🖼️</div><p className="mt-1 text-center text-muted-foreground">شرح الصورة هنا</p></div>} />
        <Item btn={<Btn>قسم جديد</Btn>} what="قسم كامل بعنوان ورقم، ينضاف بعد القسم الحالي." preview={<div className="rounded-xl border border-border bg-card p-3"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">٧</span><b className="text-lg">عنوان القسم</b></div><p className="mt-2">محتوى القسم…</p></div>} />
      </Part>

      <Part title="تبويب «النص»">
        <Item btn={<Btn>عريض / تسطير</Btn>} what="ظلّل الكلام ثم اضغط." preview={<p>كلام <b>عريض</b> وكلام <u>مسطّر</u></p>} />
        <Item btn={<Btn>تكبير / حجم عادي</Btn>} what="يكبّر الكلام المظلل أو يرجعه طبيعي." preview={<p>عادي <span className="text-3xl font-bold">كبير</span></p>} />
        <Item btn={<span className="flex gap-1">{["#ffffff", "#7dd3fc", "#facc15", "#f87171", "#86efac"].map((c) => <span key={c} style={{ background: c }} className="h-7 w-7 rounded-full border-2 border-border" />)}</span>} what="ألوان للكلام المظلل." preview={<p>{[["#ffffff", "أبيض"], ["#7dd3fc", "أزرق"], ["#facc15", "أصفر"], ["#f87171", "أحمر"], ["#86efac", "أخضر"]].map(([c, n]) => <span key={c} style={{ color: c }} className="ml-3 font-bold">{n}</span>)}</p>} />
        <Item btn={<Btn>مسح التنسيق</Btn>} what="يشيل كل التنسيقات عن الكلام المظلل." preview={<p><span className="font-bold text-destructive underline">قبل</span> ← <span>بعد</span></p>} />
      </Part>

      <Part title="تبويب «ترتيب»">
        <Item btn={<Btn>📄 نسخ / 📌 لصق</Btn>} what="انسخ عنصر أو قسم، ثم اضغط مكان ثاني والصقه هناك." />
        <Item btn={<Btn>⬆ ⬇ القسم</Btn>} what="يحرك القسم كامل لفوق أو لتحت." />
        <Item btn={<Btn>📋 تكرار القسم</Btn>} what="ينسخ القسم كامل تحته." />
        <Item btn={<Btn>🗑 القسم</Btn>} what="يحذف القسم كامل (يرجع من السجل)." />
      </Part>

      <Part title="تبويب «جدول»">
        <p>اضغط داخل خانة في الجدول أولاً.</p>
        <Item btn={<Btn>➕ صف / ➖ صف</Btn>} what="يضيف صف تحت الخانة أو يحذف صفها." />
        <Item btn={<Btn>➕ عمود / ➖ عمود</Btn>} what="يضيف عمود جنب الخانة أو يحذف عمودها." />
      </Part>

      <Part title="تبويب «السجل»">
        <p>قائمة بكل شي سويته مع الوقت، الأحدث فوق:</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between rounded-lg bg-primary px-3 py-2 text-primary-foreground"><b>● حذف جدول</b><span dir="ltr">5:12:40</span></div>
          <div className="flex justify-between rounded-lg border border-border px-3 py-2"><b>إضافة قسم</b><span dir="ltr">5:11:02</span></div>
        </div>
        <p>اضغط على أي سطر وترجع الصفحة زي ما كانت بالضبط وقتها. الخطوات اللي بعده تبقى باهتة وتقدر ترجع لها، إلا إذا سويت تعديل جديد.</p>
      </Part>

      <Part title="تبويب «أدوات»">
        <Item btn={<Btn>📖 الشرح</Btn>} what="يفتح هذي الصفحة." />
        <Item btn={<Btn>💾 تنزيل / 📂 فتح نسخة</Btn>} what="تحفظ نسخة من الدرس في جهازك وتفتحها لاحقاً." />
        <Item btn={<Btn>🖨 PDF</Btn>} what="طباعة أو حفظ PDF." />
        <Item btn={<span className="rounded-lg border border-destructive px-3 py-2 text-sm font-bold text-destructive">🧹 مسح كل المحتوى</span>} what="يمسح كل شي تحت الغلاف والتاريخ ويعطيك صفحة فاضية تبني فيها. النسخة القديمة تنحفظ في السجل باسم «قبل مسح الصفحة»." />
        <Item btn={<Btn>الأصل</Btn>} what="يرجع الدرس الأصلي." />
      </Part>

      <div className="text-center"><Link to="/" className="inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">↩ رجوع للتعديل</Link></div>
    </main>
  );
}
