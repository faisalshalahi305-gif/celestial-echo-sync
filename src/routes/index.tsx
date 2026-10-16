import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import cover from "@/assets/space-cover.jpg";
import orbits from "@/assets/orbits.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "قوانين كبلر وقانون الجذب العام | فيصل المطيري" },
      { name: "description", content: "درس فيزياء ثاني ثانوي: قوانين كبلر الثلاثة وقانون الجذب العام مع أسئلة وحل المسائل." },
      { property: "og:title", content: "قوانين كبلر وقانون الجذب العام" },
      { property: "og:description", content: "درس تفاعلي لعرضه على البروجكتور: صور، أسئلة عميقة، ومعادلات." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Lesson,
});

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="mx-auto my-8 max-w-5xl rounded-3xl border border-border bg-card/60 px-6 py-12 md:px-10">
      <h2 className="mb-6 flex items-center gap-3 text-3xl font-extrabold text-primary">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground">{n}</span>
        {title}
      </h2>
      <div className="space-y-5 leading-loose">{children}</div>
    </section>
  );
}

function QA({ q, a }: { q: string; a: ReactNode }) {
  return (
    <details className="qa group rounded-xl border border-border bg-card/80 p-5 shadow-sm">
      <summary className="flex cursor-pointer list-none flex-wrap items-start justify-between gap-4">
        <p className="flex-1 font-bold">{q}</p>
        <span className="shrink-0 rounded-lg bg-primary px-5 py-2 font-bold text-primary-foreground">
          <span className="group-open:hidden">الإجابة</span>
          <span className="hidden group-open:inline">إخفاء</span>
        </span>
      </summary>
      <div className="mt-4 rounded-lg bg-success p-4 text-success-foreground">{a}</div>
    </details>
  );
}

function Eq({ children }: { children: ReactNode }) {
  return (
    <div dir="ltr" className="my-4 rounded-xl border-2 border-primary bg-accent py-6 text-center font-mono text-3xl font-bold text-accent-foreground">
      {children}
    </div>
  );
}

const KEY = "lesson-html-v1";
const HKEY = "lesson-history-v1";
type HistEntry = { label: string; time: number; html: string };
type Hist = { list: HistEntry[]; i: number };

const SEC = (body: string, title = "عنوان القسم الجديد") => `<section class="mx-auto my-8 max-w-5xl rounded-3xl border border-border bg-card/60 px-6 py-12 md:px-10"><h2 class="mb-6 flex items-center gap-3 text-3xl font-extrabold text-primary"><span class="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground">★</span>${title}</h2><div class="space-y-5 leading-loose">${body}</div></section>`;

const TPL: Record<string, { name: string; html: string }> = {
  p: { name: "فقرة", html: `<p>فقرة جديدة… اكتب هنا.</p>` },
  h3: { name: "عنوان فرعي", html: `<h3 class="text-2xl font-bold text-primary">عنوان فرعي</h3>` },
  box: { name: "مربع مميز", html: `<div class="rounded-xl border-2 border-primary bg-accent p-6 text-accent-foreground"><p class="mb-2 text-2xl font-extrabold">عنوان مميز</p><p>معلومة مهمة هنا.</p></div>` },
  alert: { name: "تنبيه", html: `<div class="rounded-xl border-r-8 border-destructive bg-card p-5"><p class="font-extrabold text-destructive">⚠️ تنبيه</p><p>اكتب التنبيه هنا.</p></div>` },
  cards: { name: "بطاقات معلومات", html: `<div class="grid gap-4 md:grid-cols-3"><div class="rounded-xl border border-border bg-card p-5"><p class="text-3xl">🪐</p><p class="font-bold text-primary">بطاقة ١</p><p>معلومة قصيرة.</p></div><div class="rounded-xl border border-border bg-card p-5"><p class="text-3xl">☀️</p><p class="font-bold text-primary">بطاقة ٢</p><p>معلومة قصيرة.</p></div><div class="rounded-xl border border-border bg-card p-5"><p class="text-3xl">🌍</p><p class="font-bold text-primary">بطاقة ٣</p><p>معلومة قصيرة.</p></div></div>` },
  compare: { name: "مقارنة", html: `<div class="grid gap-4 md:grid-cols-2"><div class="rounded-xl border-2 border-primary bg-card p-5"><p class="mb-2 text-xl font-extrabold text-primary">الجانب الأول</p><ul class="list-disc space-y-1 pr-6"><li>نقطة</li><li>نقطة</li></ul></div><div class="rounded-xl border-2 border-border bg-card p-5"><p class="mb-2 text-xl font-extrabold">الجانب الثاني</p><ul class="list-disc space-y-1 pr-6"><li>نقطة</li><li>نقطة</li></ul></div></div>` },
  table: { name: "جدول", html: `<div class="overflow-x-auto"><table class="w-full border-collapse text-center"><thead><tr><th class="border border-border bg-primary p-3 text-primary-foreground">عمود ١</th><th class="border border-border bg-primary p-3 text-primary-foreground">عمود ٢</th><th class="border border-border bg-primary p-3 text-primary-foreground">عمود ٣</th></tr></thead><tbody><tr><td class="border border-border p-3">—</td><td class="border border-border p-3">—</td><td class="border border-border p-3">—</td></tr><tr><td class="border border-border p-3">—</td><td class="border border-border p-3">—</td><td class="border border-border p-3">—</td></tr></tbody></table></div>` },
  qa: { name: "سؤال وجواب", html: `<details class="qa group rounded-xl border border-border bg-card/80 p-5 shadow-sm"><summary class="flex cursor-pointer list-none flex-wrap items-start justify-between gap-4"><p class="flex-1 font-bold">اكتب السؤال هنا؟</p><span class="shrink-0 rounded-lg bg-primary px-5 py-2 font-bold text-primary-foreground"><span class="group-open:hidden">الإجابة</span><span class="hidden group-open:inline">إخفاء</span></span></summary><div class="mt-4 rounded-lg bg-success p-4 text-success-foreground">اكتب الإجابة هنا.</div></details>` },
  eq: { name: "معادلة", html: `<div dir="ltr" class="my-4 rounded-xl border-2 border-primary bg-accent py-6 text-center font-mono text-3xl font-bold text-accent-foreground">F = m · a</div>` },
  list: { name: "قائمة", html: `<ul class="list-disc space-y-2 pr-6"><li>نقطة أولى</li><li>نقطة ثانية</li></ul>` },
  img: { name: "صورة", html: `<img src="${orbits}" alt="صورة" class="w-full rounded-2xl shadow-lg" />` },
  media: { name: "صورة مع شرح", html: `<figure class="grid items-center gap-4 md:grid-cols-2"><img src="${orbits}" alt="صورة" class="w-full rounded-2xl shadow-lg" /><figcaption><p class="text-xl font-bold text-primary">عنوان الصورة</p><p>اكتب شرح الصورة هنا.</p></figcaption></figure>` },
  section: { name: "قسم جديد", html: SEC(`<p>اكتب هنا…</p>`) },
};
const BLANK = `<section class="blank mx-auto my-8 max-w-5xl px-6 py-6 md:px-10"><div class="space-y-5 leading-loose min-h-[40vh]"><p>ابدأ من هنا… اكتب أو أضف من تبويب «إضافة».</p></div></section>`;

type Sel = { block: HTMLElement | null; section: HTMLElement | null; cell: HTMLTableCellElement | null };

function Toolbar({ root, commit, hist, goTo, pickImage, done }: {
  root: React.RefObject<HTMLDivElement | null>; commit: (label: string) => void; hist: Hist; goTo: (i: number) => void;
  pickImage: (i: HTMLImageElement) => void; done: () => void;
}) {
  const last = useRef<Sel>({ block: null, section: null, cell: null });
  const clip = useRef<string | null>(null);
  const [tab, setTab] = useState<"text" | "add" | "order" | "table" | "history" | "tools">("add");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [inTable, setInTable] = useState(false);
  const hideKeyboard = () => { (document.activeElement as HTMLElement | null)?.blur(); getSelection()?.removeAllRanges(); };
  const barRef = useRef<HTMLDivElement>(null);
  const vvTop = useRef(0);
  const [vvH, setVvH] = useState(0);
  const raf = useRef(0);

  const placeNow = () => {
    const b = last.current.block;
    if (!b || !b.isConnected) return setPos(null);
    const r = b.getBoundingClientRect();
    const barH = barRef.current?.offsetHeight ?? 110;
    const top = vvTop.current + barH + 6;
    const bottom = vvTop.current + (window.visualViewport?.height ?? innerHeight) - 50;
    if (r.bottom < top || r.top - 46 > bottom) return setPos(null);
    setPos({ top: Math.min(bottom, Math.max(top, r.top - 46)), left: Math.max(8, Math.min(r.left, innerWidth - 230)) });
  };
  const place = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(placeNow); };

  // Keep the toolbar glued to the visible screen area, even while the phone keyboard is open.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    let f = 0;
    const sync = () => {
      cancelAnimationFrame(f);
      f = requestAnimationFrame(() => {
        vvTop.current = Math.max(0, vv.offsetTop);
        if (barRef.current) barRef.current.style.transform = `translate3d(0, ${vvTop.current}px, 0)`;
        setVvH(vv.height);
        placeNow();
      });
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => { cancelAnimationFrame(f); vv.removeEventListener("resize", sync); vv.removeEventListener("scroll", sync); };
  }, []);
  const kbOpen = vvH > 0 && vvH < innerHeight - 120;
  const select = (nb: HTMLElement | null) => {
    if (nb !== last.current.block) { last.current.block?.classList.remove("is-sel"); nb?.classList.add("is-sel"); last.current.block = nb; }
    place();
  };
  useEffect(() => {
    const on = () => {
      const n = getSelection()?.anchorNode;
      const el = (n?.nodeType === 1 ? n : n?.parentElement) as HTMLElement | null;
      if (!el || !root.current?.contains(el)) return;
      last.current.section = el.closest("section, header");
      last.current.cell = el.closest("td, th");
      setInTable(!!last.current.cell);
      let b: HTMLElement | null = el;
      while (b && b.parentElement && !b.parentElement.classList.contains("space-y-5") && b.tagName !== "SECTION") b = b.parentElement;
      select(b && b.tagName !== "SECTION" && b.tagName !== "HEADER" ? b : null);
    };
    document.addEventListener("selectionchange", on);
    addEventListener("scroll", place, { passive: true });
    return () => { document.removeEventListener("selectionchange", on); removeEventListener("scroll", place); last.current.block?.classList.remove("is-sel"); };
  }, [root]);
  // after history jumps the DOM is replaced; forget stale selection
  useEffect(() => { if (last.current.block && !last.current.block.isConnected) { last.current = { block: null, section: null, cell: null }; setPos(null); setInTable(false); } }, [hist]);

  const cmd = (c: string, label: string, v?: string) => { document.execCommand(c, false, v); commit(label); };
  const main = () => root.current!.querySelector("main")!;
  const insertNode = (html: string, isSection: boolean) => {
    const { block, section } = last.current;
    const t = document.createElement("template"); t.innerHTML = html;
    const node = t.content.firstElementChild as HTMLElement;
    if (isSection) (section && section.tagName !== "HEADER" ? section : main().querySelector("footer")?.previousElementSibling ?? main().firstElementChild!).after(node);
    else if (block) block.after(node);
    else {
      let box = (section?.querySelector(".space-y-5") ?? main().querySelector("section .space-y-5")) as HTMLElement | null;
      if (!box) { main().querySelector("header")!.insertAdjacentHTML("afterend", BLANK); box = main().querySelector("section .space-y-5"); }
      box!.append(node);
    }
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    return node;
  };
  const insert = (k: string) => {
    const node = insertNode(TPL[k]!.html, k === "section");
    if (node.tagName === "IMG") pickImage(node as HTMLImageElement);
    if (k !== "section") select(node);
    commit(`إضافة ${TPL[k]!.name}`);
  };
  const need = (what: "block" | "section") => {
    const el = last.current[what];
    if (!el || !el.isConnected || el.tagName === "HEADER") { alert("اضغط أولاً داخل العنصر"); return null; }
    return el;
  };
  const kind = (el: HTMLElement) => el.tagName === "SECTION" ? "قسم" : el.querySelector("table") ? "جدول" : el.tagName === "IMG" ? "صورة" : el.tagName === "DETAILS" ? "سؤال" : "عنصر";
  const move = (dir: -1 | 1, what: "block" | "section") => {
    const el = need(what); if (!el) return;
    const sib = dir < 0 ? el.previousElementSibling : el.nextElementSibling;
    if (!sib || sib.tagName === "HEADER" || sib.tagName === "FOOTER") return;
    dir < 0 ? sib.before(el) : sib.after(el);
    el.scrollIntoView({ behavior: "smooth", block: "center" }); place();
    commit(`تحريك ${kind(el)} ${dir < 0 ? "لأعلى" : "لأسفل"}`);
  };
  const dup = (what: "block" | "section") => {
    const el = need(what); if (!el) return;
    const c = el.cloneNode(true) as HTMLElement; c.classList.remove("is-sel"); el.after(c);
    if (what === "block") select(c);
    commit(`تكرار ${kind(el)}`);
  };
  const del = (what: "block" | "section") => {
    const el = need(what); if (!el) return;
    const k = kind(el); el.remove(); last.current[what] = null; if (what === "section") last.current.block = null;
    setPos(null); commit(`حذف ${k}`);
  };
  const copy = (what: "block" | "section") => { const el = need(what); if (!el) return; clip.current = clean(el.outerHTML); alert(`تم نسخ ال${kind(el)} ✓ — اضغط مكان ثاني ثم «لصق»`); };
  const paste = () => {
    if (!clip.current) return alert("ما نسخت شي بعد");
    const isSec = clip.current.startsWith("<section");
    const node = insertNode(clip.current, isSec); if (!isSec) select(node);
    commit("لصق");
  };
  const clearAll = () => {
    if (!confirm("مسح كل المحتوى تحت الغلاف؟ (تقدر ترجعه من «السجل»)")) return;
    commit("قبل مسح الصفحة");
    main().querySelectorAll(":scope > section").forEach((s) => s.remove());
    main().querySelector("header")!.insertAdjacentHTML("afterend", BLANK);
    last.current = { block: null, section: null, cell: null }; setPos(null);
    commit("مسح كل المحتوى");
  };
  const table = (op: "row+" | "row-" | "col+" | "col-") => {
    const cell = last.current.cell; if (!cell?.isConnected) return alert("اضغط داخل خانة في الجدول");
    const tr = cell.parentElement as HTMLTableRowElement; const tbl = cell.closest("table")!; const idx = cell.cellIndex;
    if (op === "row+") { const n = tr.cloneNode(true) as HTMLTableRowElement; n.querySelectorAll("td,th").forEach((c) => (c.innerHTML = "—")); tr.after(n); }
    if (op === "row-") { if (tbl.rows.length > 1) tr.remove(); }
    if (op === "col+") Array.from(tbl.rows).forEach((r) => { const c = r.cells[idx]; if (c) { const n = c.cloneNode(false) as HTMLElement; n.innerHTML = "—"; c.after(n); } });
    if (op === "col-") { if (tr.cells.length > 1) Array.from(tbl.rows).forEach((r) => r.cells[idx]?.remove()); }
    last.current.cell = null;
    commit({ "row+": "إضافة صف", "row-": "حذف صف", "col+": "إضافة عمود", "col-": "حذف عمود" }[op]);
  };
  const backup = () => {
    const blob = new Blob([clean(root.current!.innerHTML)], { type: "text/html" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "درس.html"; a.click();
  };
  const restore = () => {
    const i = document.createElement("input"); i.type = "file"; i.accept = ".html";
    i.onchange = async () => { const f = i.files?.[0]; if (f) { commit("قبل فتح نسخة"); root.current!.innerHTML = await f.text(); commit("فتح نسخة من ملف"); } };
    i.click();
  };

  const B = ({ t, on, cls = "" }: { t: string; on: () => void; cls?: string }) => (
    <button onMouseDown={(e) => e.preventDefault()} onClick={on}
      className={`shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-sm font-bold active:bg-primary active:text-primary-foreground ${cls}`}>{t}</button>
  );
  const tabs = [["add", "إضافة"], ["text", "النص"], ["order", "ترتيب"], ["table", "جدول"], ["history", "السجل"], ["tools", "أدوات"]] as const;
  const fmt = (t: number) => new Date(t).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <>
      <div ref={barRef} className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card shadow-2xl will-change-transform print:hidden">
        <div className="flex items-center gap-1 border-b border-border px-2 pt-2">
          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {tabs.map(([k, l]) => (
            <button key={k} onMouseDown={(e) => e.preventDefault()} onClick={() => setTab(k)}
              className={`whitespace-nowrap rounded-t-lg px-2.5 py-2 text-sm font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{l}</button>
          ))}
          </div>
          <button onMouseDown={(e) => e.preventDefault()} onClick={() => goTo(hist.i - 1)} disabled={hist.i <= 0} aria-label="تراجع" className="px-1 text-xl disabled:opacity-30">↶</button>
          <button onMouseDown={(e) => e.preventDefault()} onClick={() => goTo(hist.i + 1)} disabled={hist.i >= hist.list.length - 1} aria-label="إعادة" className="px-1 text-xl disabled:opacity-30">↷</button>
          {kbOpen && <button onMouseDown={(e) => e.preventDefault()} onClick={hideKeyboard} aria-label="إخفاء الكيبورد" className="px-1 text-xl">⌨️</button>}
          <button onMouseDown={(e) => e.preventDefault()} onClick={() => { hideKeyboard(); done(); location.href = "/guide"; }} aria-label="شرح الأدوات" className="whitespace-nowrap rounded-lg border border-primary px-2 py-2 text-sm font-bold text-primary">📖 شرح</button>
          <button onClick={() => { hideKeyboard(); done(); }} className="whitespace-nowrap rounded-lg bg-success px-3 py-2 text-sm font-bold text-success-foreground">✓ حفظ</button>
        </div>
        <div style={{ maxHeight: vvH ? Math.round(vvH * (kbOpen ? 0.3 : 0.45)) : undefined }} className="flex max-h-[45vh] gap-2 overflow-x-auto overscroll-contain px-2 py-2">
          {tab === "add" && Object.keys(TPL).map((k) => <B key={k} t={TPL[k]!.name} on={() => insert(k)} />)}
          {tab === "text" && <>
            <B t="عريض" on={() => cmd("bold", "تنسيق عريض")} />
            <B t="تسطير" on={() => cmd("underline", "تسطير")} />
            <B t="تكبير" on={() => cmd("fontSize", "تكبير الخط", "6")} />
            <B t="حجم عادي" on={() => cmd("fontSize", "حجم عادي", "3")} />
            {["#ffffff", "#7dd3fc", "#facc15", "#f87171", "#86efac"].map((c) => (
              <button key={c} aria-label="لون" onMouseDown={(e) => e.preventDefault()} onClick={() => cmd("foreColor", "تغيير اللون", c)} style={{ background: c }} className="h-9 w-9 shrink-0 rounded-full border-2 border-border" />
            ))}
            <B t="مسح التنسيق" on={() => cmd("removeFormat", "مسح التنسيق")} />
          </>}
          {tab === "order" && <>
            <B t="📄 نسخ العنصر" on={() => copy("block")} />
            <B t="📌 لصق" on={paste} />
            <B t="⬆ القسم" on={() => move(-1, "section")} />
            <B t="⬇ القسم" on={() => move(1, "section")} />
            <B t="📋 تكرار القسم" on={() => dup("section")} />
            <B t="📄 نسخ القسم" on={() => copy("section")} />
            <B t="🗑 القسم" on={() => del("section")} />
          </>}
          {tab === "table" && <>
            <B t="➕ جدول جديد" on={() => insert("table")} />
            <B t="➕ صف" on={() => table("row+")} />
            <B t="➖ صف" on={() => table("row-")} />
            <B t="➕ عمود" on={() => table("col+")} />
            <B t="➖ عمود" on={() => table("col-")} />
          </>}
          {tab === "history" && (
            <div className="flex w-full flex-col gap-1 overflow-y-auto">
              {hist.list.map((h, i) => ({ h, i })).reverse().map(({ h, i }) => (
                <button key={h.time + "-" + i} onMouseDown={(e) => e.preventDefault()} onClick={() => goTo(i)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-right text-sm ${i === hist.i ? "border-primary bg-primary text-primary-foreground" : i > hist.i ? "border-border opacity-50" : "border-border bg-background"}`}>
                  <span className="font-bold">{i === hist.i ? "● " : ""}{h.label}</span>
                  <span dir="ltr" className="text-xs opacity-80">{fmt(h.time)}</span>
                </button>
              ))}
            </div>
          )}
          {tab === "tools" && <>
            <B t="📖 الشرح" on={() => { done(); location.href = "/guide"; }} />
            <B t="💾 تنزيل نسخة" on={backup} />
            <B t="📂 فتح نسخة" on={restore} />
            <B t="🖨 PDF" on={() => window.print()} />
            <B t="🧹 مسح كل المحتوى" on={clearAll} cls="border-destructive text-destructive" />
            <B t="الأصل" on={() => { if (confirm("إرجاع الدرس الأصلي؟ (يبقى في السجل)")) { commit("قبل إرجاع الأصل"); localStorage.removeItem(KEY); location.reload(); } }} />
          </>}
        </div>
      </div>
      {pos && (
        <div style={{ top: pos.top, left: pos.left }} className="fixed z-40 flex gap-1 rounded-xl border border-border bg-card p-1 shadow-2xl print:hidden">
          {([["⬆️", () => move(-1, "block"), "تحريك لأعلى"], ["⬇️", () => move(1, "block"), "تحريك لأسفل"], ["📋", () => dup("block"), "تكرار"], ["📄", () => copy("block"), "نسخ"], ["🗑️", () => del("block"), "حذف"]] as const).map(([t, on, l]) => (
            <button key={l} aria-label={l} title={l} onMouseDown={(e) => e.preventDefault()} onClick={on} className="rounded-lg px-2 py-1.5 text-lg active:bg-primary">{t}</button>
          ))}
          {inTable && <button onMouseDown={(e) => e.preventDefault()} onClick={() => setTab("table")} className="rounded-lg px-2 text-sm font-bold text-primary">جدول</button>}
        </div>
      )}
    </>
  );
}

const clean = (h: string) => h.replace(/\s?is-sel/g, "");

function Stars() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0, t0 = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = () => { c.width = innerWidth; c.height = innerHeight; };
    size();
    addEventListener("resize", size);
    const stars = Array.from({ length: innerWidth < 700 ? 60 : 110 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.3,
      p: Math.random() * Math.PI * 2, s: Math.random() * 0.04 + 0.01, v: Math.random() * 0.0001 + 0.00004,
    }));
    ctx.fillStyle = "#cfe3ff";
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden || t - t0 < 66) return; // ~15fps is enough for twinkling
      t0 = t;
      ctx.clearRect(0, 0, c.width, c.height);
      for (const st of stars) {
        st.p += st.s; st.y -= st.v; if (st.y < 0) st.y = 1;
        ctx.globalAlpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(st.p));
        ctx.beginPath(); ctx.arc(st.x * c.width, st.y * c.height, st.r, 0, 7); ctx.fill();
      }
    };
    if (reduce) draw(1000); else raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}

function shrink(file: File): Promise<string> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1200 / img.width);
      const cv = document.createElement("canvas");
      cv.width = img.width * k; cv.height = img.height * k;
      cv.getContext("2d")!.drawImage(img, 0, 0, cv.width, cv.height);
      res(cv.toDataURL("image/jpeg", 0.75));
    };
    img.src = URL.createObjectURL(file);
  });
}

function Lesson() {
  const ref = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const editRef = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const target = useRef<HTMLImageElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [hist, setHistState] = useState<Hist>({ list: [], i: -1 });
  const histRef = useRef(hist);

  const saveNow = () => {
    try { if (ref.current) localStorage.setItem(KEY, clean(ref.current.innerHTML)); } catch { alert("المساحة ممتلئة، جرّب صورة أصغر"); }
  };
  const setHist = (v: Hist) => {
    histRef.current = v; setHistState(v);
    for (let keep = v.list.length; keep > 0; keep = Math.floor(keep / 2)) {
      try { const s = v.list.length - keep; localStorage.setItem(HKEY, JSON.stringify({ list: v.list.slice(s), i: v.i - s })); return; } catch { /* too big, keep fewer */ }
    }
  };
  const commit = (label: string) => {
    clearTimeout(timer.current);
    if (!ref.current) return;
    const html = clean(ref.current.innerHTML);
    const h = histRef.current;
    if (h.list[h.i]?.html === html) return;
    const list = [...h.list.slice(0, h.i + 1), { label, time: Date.now(), html }].slice(-60);
    setHist({ list, i: list.length - 1 });
    saveNow();
  };
  const flush = () => { if (timer.current) { clearTimeout(timer.current); timer.current = undefined; commit("تعديل نص"); } };
  const goTo = (i: number) => {
    flush();
    const h = histRef.current; const e = h.list[i]; if (!e || !ref.current) return;
    ref.current.innerHTML = e.html; setHist({ ...h, i }); saveNow();
  };

  useEffect(() => {
    const el = ref.current!;
    const saved = localStorage.getItem(KEY);
    if (saved) el.innerHTML = saved;
    let h: Hist | null = null;
    try { h = JSON.parse(localStorage.getItem(HKEY) || "null"); } catch { /* ignore */ }
    if (h?.list?.length) { histRef.current = h; setHistState(h); }
    else { const v = { list: [{ label: "الحالة الأولى", time: Date.now(), html: clean(el.innerHTML) }], i: 0 }; histRef.current = v; setHistState(v); }
    const onClick = (e: MouseEvent) => {
      if (!editRef.current) return;
      const t = e.target as HTMLElement;
      if (t.tagName === "IMG") { e.preventDefault(); target.current = t as HTMLImageElement; fileRef.current?.click(); }
      if (t.closest("summary")) e.preventDefault();
    };
    const onInput = () => { clearTimeout(timer.current); timer.current = setTimeout(() => { timer.current = undefined; commit("تعديل نص"); }, 1000); };
    const onKey = (e: KeyboardEvent) => {
      if (!editRef.current || !(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) { e.preventDefault(); flush(); goTo(histRef.current.i - 1); }
      else if (k === "y" || (k === "z" && e.shiftKey)) { e.preventDefault(); goTo(histRef.current.i + 1); }
    };
    const onUnload = () => { flush(); saveNow(); };
    // Leaving the app/tab: save and close the keyboard so it doesn't stay stuck on screen.
    const onHide = () => { if (document.visibilityState === "hidden") { flush(); saveNow(); (document.activeElement as HTMLElement | null)?.blur(); } };
    el.addEventListener("click", onClick);
    el.addEventListener("input", onInput);
    addEventListener("keydown", onKey);
    addEventListener("beforeunload", onUnload);
    addEventListener("pagehide", onUnload);
    document.addEventListener("visibilitychange", onHide);
    return () => { el.removeEventListener("click", onClick); el.removeEventListener("input", onInput); removeEventListener("keydown", onKey); removeEventListener("beforeunload", onUnload); removeEventListener("pagehide", onUnload); document.removeEventListener("visibilitychange", onHide); };
  }, []);

  const toggle = () => {
    const next = !editing;
    editRef.current = next;
    setEditing(next);
    ref.current!.contentEditable = next ? "true" : "false";
    ref.current!.classList.toggle("editing", next);
    if (!next) { flush(); saveNow(); (document.activeElement as HTMLElement | null)?.blur(); getSelection()?.removeAllRanges(); }
  };

  return (
    <>
      <Stars />
      {!editing && (
        <button onClick={toggle} className="fixed bottom-4 left-4 z-50 rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground shadow-lg print:hidden">
          ✏️ تعديل
        </button>
      )}
      {editing && <Toolbar root={ref} commit={commit} hist={hist} goTo={goTo} done={toggle} pickImage={(img) => { target.current = img; fileRef.current?.click(); }} />}
      <input
        ref={fileRef} type="file" accept="image/*" hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f && target.current) { target.current.src = await shrink(f); target.current.removeAttribute("srcset"); commit("تغيير صورة"); }
          e.target.value = "";
        }}
      />
      <div ref={ref} suppressContentEditableWarning className={editing ? "pt-28" : ""}>
        <Content />
      </div>
    </>
  );
}

const Content = memo(function Content() {
  return (
    <main className="min-h-screen text-foreground">
      <header className="relative isolate overflow-hidden py-20 text-center text-foreground">
        <img src={cover} width={1920} height={832} alt="المجموعة الشمسية" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/50 to-background" />
        <p className="text-lg text-primary">فيزياء ٢ — الصف الثاني الثانوي — الفصل الدراسي الأول — الوحدة الأولى</p>
        <h1 className="mt-3 text-4xl font-extrabold md:text-6xl">الجاذبية وحركة الكواكب: قوانين كبلر</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-lg">
          <span className="rounded-full border border-border bg-card/70 px-4 py-1">الاسم: <b>فيصل المطيري</b></span>
          <span className="rounded-full border border-border bg-card/70 px-4 py-1">التاريخ: <b>الجمعة ١٦ أكتوبر ٢٠٢٦م</b></span>
        </div>
      </header>

      <Section n="١" title="تخيل لو أن الأرض تسقط طوال الوقت!">
        <p className="text-2xl font-extrabold leading-loose text-primary">تخيل لو قلت لك إن الأرض طول الوقت تسقط!</p>
        <p>إحنا نعرف إن أي شيء نتركه من يدنا يطيح للأرض. طيب ليه الأرض ما تطيح في الشمس وهي تجذبها طول الوقت؟</p>
        <div className="rounded-xl border-2 border-primary bg-accent p-6 text-accent-foreground">
          <p className="mb-3 text-2xl font-extrabold">السر هو سرعة الأرض!</p>
          <p>
            الأرض تتحرك حول الشمس بسرعة تقارب{" "}
            <span dir="ltr" className="mx-1 inline-block rounded-lg bg-primary px-3 py-1 font-mono text-primary-foreground">107,000 km/h</span>{" "}
            أي نحو ١٠٧ آلاف كيلومتر في الساعة.
          </p>
        </div>
        <p>جاذبية الشمس تسحب الأرض باتجاهها وتغيّر اتجاه حركتها باستمرار، لكن سرعة الأرض تخليها تستمر في الدوران حول الشمس بدل ما تتجه لها مباشرة.</p>
        <p className="rounded-xl border border-border bg-card p-5 text-xl font-bold">
          يعني الأرض لا هي ثابتة ولا هي تهرب من الشمس، بل تتحرك والجاذبية تغيّر مسارها باستمرار.
        </p>
        <QA
          q="سؤال للفصل: إذا الشمس تجذب الأرض طول الوقت، ليه الأرض ما تصطدم فيها؟"
          a={
            <span>
              لأن للأرض سرعة أفقية كبيرة جدًا. هي «تسقط» فعلًا نحو الشمس، لكن أثناء سقوطها تمرّ بجانبها، فتبقى تدور في مدار بدل ما تقترب منها.
              لو توقفت سرعة الأرض لسقطت في الشمس، ولو زادت كثيرًا لانطلقت بعيدًا في الفضاء.
            </span>
          }
        />
        <div className="rounded-xl bg-accent p-5 text-accent-foreground">
          <p className="mb-2 font-bold">الأهداف:</p>
          <ul className="list-disc space-y-1 pr-6">
            <li>أن أذكر قوانين كبلر الثلاثة.</li>
            <li>أن أفسّر حركة الكواكب باستخدام قانون الجذب العام.</li>
            <li>أن أحل مسائل على قانون كبلر الثالث.</li>
          </ul>
        </div>
      </Section>

      <Section n="٢" title="لنتأمل الصورة">
        <img src={orbits} width={1600} height={912} alt="الشمس والكواكب في مدارات إهليلجية" className="w-full rounded-2xl shadow-lg" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/60 p-5"><b className="text-primary">الشمس ☀️</b><p>تقع في إحدى بؤرتي المدار وليس في مركزه.</p></div>
          <div className="rounded-xl border border-border bg-background/60 p-5"><b className="text-primary">المدار الإهليلجي</b><p>مسار الكوكب شكله بيضاوي (قطع ناقص) وليس دائرة تامة.</p></div>
          <div className="rounded-xl border border-border bg-background/60 p-5"><b className="text-primary">الكواكب</b><p>كلما ابتعد الكوكب عن الشمس زاد زمن دورته حولها.</p></div>
        </div>
        <h3 className="pt-4 text-2xl font-bold">قوانين كبلر الثلاثة</h3>
        <ol className="list-decimal space-y-3 pr-6">
          <li><b>القانون الأول:</b> تتحرك الكواكب في مدارات إهليلجية، وتقع الشمس في إحدى البؤرتين.</li>
          <li><b>القانون الثاني:</b> الخط الواصل بين الشمس والكوكب يمسح مساحات متساوية في أزمنة متساوية (الكوكب أسرع عندما يقترب من الشمس).</li>
          <li><b>القانون الثالث:</b> مربع النسبة بين زمني دورتي كوكبين يساوي مكعب النسبة بين متوسطي بُعديهما عن الشمس.</li>
        </ol>
      </Section>

      <Section n="٣" title="أسئلة على الدرس">
        <QA q="ما شكل مدار الكوكب حول الشمس؟" a="إهليلجي (قطع ناقص)، والشمس في إحدى بؤرتيه." />
        <QA q="متى تكون سرعة الأرض في مدارها أكبر ما يمكن؟" a="عندما تكون أقرب ما يمكن إلى الشمس (الحضيض)، حسب قانون كبلر الثاني." />
        <QA q="أيهما زمن دورته أطول: المريخ أم الأرض؟ ولماذا؟" a="المريخ، لأنه أبعد عن الشمس، وحسب القانون الثالث يزداد الزمن الدوري بزيادة البعد." />
      </Section>

      <Section n="٤" title="أسئلة عميقة 🤔 فكّر قبل أن تضغط!">
        <QA q="لو اختفت الشمس فجأة، هل ستشعر الأرض بذلك فوراً؟" a="لا! الجاذبية تنتقل بسرعة الضوء، فستستمر الأرض في مدارها نحو ٨ دقائق و٢٠ ثانية قبل أن تنطلق في خط مستقيم — وهو نفس الوقت الذي سنظل نرى فيه ضوء الشمس." />
        <QA q="القمر ينجذب نحو الأرض باستمرار… فلماذا لا يسقط عليها؟" a="القمر في الحقيقة «يسقط» دائماً! لكن سرعته الأفقية كبيرة جداً، فكلما سقط نحو الأرض تنحني الأرض تحته، فيبقى يدور حولها. هذا هو معنى المدار." />
        <QA q="رائد الفضاء في المحطة الدولية يطفو، فهل الجاذبية هناك صفر؟" a="لا، الجاذبية هناك نحو ٩٠٪ من قيمتها على سطح الأرض! يطفو لأنه والمحطة يسقطان معاً سقوطاً حراً حول الأرض (انعدام الوزن الظاهري)." />
        <QA q="هل قوانين كبلر تنطبق على الأقمار الاصطناعية حول الأرض؟" a="نعم، تنطبق على أي جسم يدور حول جسم مركزي، لكن نقارن فقط بين أجسام تدور حول الجسم المركزي نفسه (الأرض هنا)." />
        <QA q="لماذا يكون الصيف في السعودية بينما الأرض أبعد عن الشمس (في يوليو)؟" a="لأن الفصول سببها ميل محور الأرض (٢٣.٥°) وليس المسافة. في يوليو يميل نصف الكرة الشمالي نحو الشمس فتسقط الأشعة عمودية أكثر." />
      </Section>

      <Section n="٥" title="معلومات إضافية 💡">
        <ul className="list-disc space-y-2 pr-6">
          <li>استنتج كبلر قوانينه من أرصاد دقيقة جمعها أستاذه <b>تيخو براهي</b> على مدى ٢٠ سنة.</li>
          <li>نيوتن فسّر قوانين كبلر بقانون الجذب العام:</li>
        </ul>
        <Eq>F = G · m₁ m₂ / r²</Eq>
        <p><b>F</b>: قوة الجذب (N) — <b>G</b> = 6.67 × 10⁻¹¹ N·m²/kg² ثابت الجذب العام — <b>m₁ , m₂</b>: الكتلتان (kg) — <b>r</b>: المسافة بين مركزيهما (m).</p>
        <p>القوة تقل بمربع المسافة: إذا تضاعفت المسافة مرتين تقل القوة إلى الربع.</p>
      </Section>

      <Section n="٦" title="قانون كبلر الثالث">
        <Eq>( T<sub>A</sub> / T<sub>B</sub> )² = ( r<sub>A</sub> / r<sub>B</sub> )³</Eq>
        <p><b>T</b>: الزمن الدوري (زمن دورة كاملة) — <b>r</b>: متوسط بعد الكوكب عن الشمس. يجب أن تكون الوحدات متماثلة للكوكبين.</p>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-3 text-2xl font-bold text-primary">مثال محلول</h3>
          <p>متوسط بعد المريخ عن الشمس يساوي <b>1.52</b> مرة بعد الأرض. احسب الزمن الدوري للمريخ بالسنوات.</p>
          <ol className="mt-4 list-decimal space-y-3 pr-6">
            <li><b>المعطيات:</b> T<sub>B</sub> (الأرض) = 1 سنة، r<sub>A</sub>/r<sub>B</sub> = 1.52</li>
            <li><b>نعوّض في القانون:</b> <span dir="ltr" className="font-mono">(T<sub>A</sub>/1)² = (1.52)³</span></li>
            <li><b>نحسب المكعب:</b> <span dir="ltr" className="font-mono">1.52 × 1.52 × 1.52 = 3.51</span></li>
            <li><b>نأخذ الجذر التربيعي:</b> <span dir="ltr" className="font-mono">T<sub>A</sub> = √3.51 ≈ 1.87</span></li>
            <li><b>الجواب:</b> الزمن الدوري للمريخ ≈ <b>1.87 سنة</b> ✅</li>
          </ol>
        </div>
        <div className="rounded-xl bg-accent p-5 text-accent-foreground">
          <b>خطوات الحل دائماً:</b> ١) اكتب المعطيات ٢) اكتب القانون ٣) عوّض ٤) احسب الأس ٥) خذ الجذر المناسب ٦) اكتب الوحدة.
        </div>
        <QA q="تدريب: كوكب متوسط بعده عن الشمس 4 أضعاف بعد الأرض، كم زمنه الدوري؟" a={<span>(T)² = 4³ = 64 ← T = √64 = <b>8 سنوات</b></span>} />
      </Section>

      <footer className="py-8 text-center text-muted-foreground">إعداد الطالب: فيصل المطيري — فيزياء ٢</footer>
    </main>
  );
});
