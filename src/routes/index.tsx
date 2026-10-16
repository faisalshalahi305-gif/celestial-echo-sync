import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
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

type T = "p" | "h2" | "h3" | "list" | "qa" | "eq" | "cards" | "compare" | "img" | "media" | "section";
type Block = { id: string; type: T; text: string; a?: string; items?: string[]; src?: string; children?: Block[] };

const NAMES: [T, string][] = [
  ["p", "فقرة"], ["h2", "عنوان رئيسي"], ["h3", "عنوان فرعي"], ["section", "جدول جديد"], ["cards", "بطاقات معلومات"],
  ["compare", "مقارنة"], ["qa", "سؤال وجواب"], ["eq", "معادلة"], ["list", "قائمة"], ["img", "صورة"], ["media", "صورة مع شرح"],
];
const uid = () => Math.random().toString(36).slice(2, 10);
const line = (): Block => ({ id: uid(), type: "p", text: "" });
const lines = (n: number) => Array.from({ length: n }, line);
const make = (id: string, type: T): Block => {
  switch (type) {
    case "list": return { id, type, text: "", items: [""] };
    case "qa": return { id, type, text: "", a: "" };
    case "cards": return { id, type, text: "", items: ["", "", ""] };
    case "compare": return { id, type, text: "", items: ["", ""] };
    case "img": case "media": return { id, type, text: "", src: orbits };
    case "section": return { id, type, text: "", children: lines(3) };
    default: return { id, type, text: "" };
  }
};

let focusId: string | null = null;
const focusEnd = (el: HTMLElement) => {
  el.focus();
  const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
  getSelection()?.removeAllRanges(); getSelection()?.addRange(r);
};
const moveLine = (from: HTMLElement, dir: 1 | -1) => {
  const all = Array.from(document.querySelectorAll<HTMLElement>("[data-line]"));
  const n = all[all.indexOf(from) + dir];
  if (n) focusEnd(n);
};

function Field({ id, value, onChange, className = "", ph, onKeyDown }: {
  id: string; value: string; onChange: (v: string) => void; className?: string; ph: string; onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
}) {
  const r = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if (r.current && r.current.textContent !== value) r.current.textContent = value; }, [value]);
  useEffect(() => { if (focusId === id && r.current) { focusId = null; focusEnd(r.current); } }, [id]);
  return (
    <div
      ref={r} data-line contentEditable suppressContentEditableWarning data-ph={ph}
      onInput={(e) => onChange(e.currentTarget.textContent ?? "")}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "ArrowDown") { e.preventDefault(); moveLine(e.currentTarget, 1); }
        if (e.key === "ArrowUp") { e.preventDefault(); moveLine(e.currentTarget, -1); }
      }}
      className={`min-h-[1.75em] outline-none empty:before:text-muted-foreground/50 empty:focus:before:content-[attr(data-ph)] ${className}`}
    />
  );
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

function Pic({ src, onChange }: { src?: string | undefined; onChange: (s: string) => void }) {
  const f = useRef<HTMLInputElement>(null);
  return (
    <>
      <img src={src} alt="" onClick={() => f.current?.click()} className="w-full cursor-pointer rounded-2xl shadow-lg" />
      <input ref={f} type="file" accept="image/*" hidden onChange={async (e) => { const x = e.target.files?.[0]; if (x) onChange(await shrink(x)); e.target.value = ""; }} />
    </>
  );
}

function Lines({ blocks, onChange }: { blocks: Block[]; onChange: (b: Block[]) => void }) {
  const [menu, setMenu] = useState<{ id: string; i: number } | null>(null);
  const set = (i: number, patch: Partial<Block>) => onChange(blocks.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const insertAfter = (i: number) => { const n = line(); focusId = n.id; onChange([...blocks.slice(0, i + 1), n, ...blocks.slice(i + 1)]); };
  const remove = (i: number) => {
    if (blocks.length <= 1) return;
    focusId = blocks[i - 1]?.id ?? null;
    if (blocks[i - 1] && blocks[i - 1]!.type !== "p") focusId = null;
    onChange(blocks.filter((_, j) => j !== i));
  };
  const pick = (i: number, t: T) => {
    setMenu(null);
    const b = make(blocks[i]!.id, t);
    const next = [...blocks]; next[i] = b;
    if (i === blocks.length - 1) next.push(line());
    focusId = t === "p" || t === "h2" || t === "h3" || t === "eq" ? b.id : null;
    onChange(next);
  };
  const keys = (i: number, b: Block) => (e: KeyboardEvent<HTMLDivElement>) => {
    const opts = b.type === "p" && b.text.startsWith("/") ? NAMES.filter(([, n]) => n.includes(b.text.slice(1).trim())) : [];
    if (opts.length) {
      const sel = menu?.id === b.id ? menu.i : 0;
      if (e.key === "ArrowDown") { e.preventDefault(); return setMenu({ id: b.id, i: (sel + 1) % opts.length }); }
      if (e.key === "ArrowUp") { e.preventDefault(); return setMenu({ id: b.id, i: (sel - 1 + opts.length) % opts.length }); }
      if (e.key === "Enter") { e.preventDefault(); return pick(i, opts[sel]![0]); }
      if (e.key === "Escape") { e.preventDefault(); return set(i, { text: "" }); }
    }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); insertAfter(i); }
    if (e.key === "Backspace" && !e.currentTarget.textContent && (b.type === "p" || b.type === "h2" || b.type === "h3" || b.type === "eq")) {
      e.preventDefault();
      if (b.type !== "p") set(i, { type: "p" }); else remove(i);
    }
  };
  const del = (i: number) => (
    <button onClick={() => (blocks.length > 1 ? onChange(blocks.filter((_, j) => j !== i)) : set(i, make(blocks[i]!.id, "p")))} aria-label="حذف"
      className="absolute -left-2 -top-3 hidden rounded-full border border-border bg-card px-2 text-sm group-hover:block group-focus-within:block">✕</button>
  );

  return (
    <div className="space-y-2">
      {blocks.map((b, i) => {
        const k = keys(i, b);
        const opts = b.type === "p" && b.text.startsWith("/") ? NAMES.filter(([, n]) => n.includes(b.text.slice(1).trim())) : [];
        const sel = menu?.id === b.id ? menu.i : 0;
        const item = (j: number, v: string) => { const items = [...(b.items ?? [])]; items[j] = v; set(i, { items }); };
        switch (b.type) {
          case "p": return (
            <div key={b.id} className="relative">
              <Field id={b.id} value={b.text} onChange={(v) => set(i, { text: v })} onKeyDown={k} ph="اكتب / للإضافة…" className="leading-loose" />
              {opts.length > 0 && (
                <div className="absolute right-0 top-full z-50 mt-1 flex max-h-72 w-56 flex-col overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-2xl">
                  {opts.map(([t, n], j) => (
                    <button key={t} onMouseDown={(e) => { e.preventDefault(); pick(i, t); }}
                      className={`rounded-lg px-3 py-2 text-right text-sm font-bold ${j === sel ? "bg-primary text-primary-foreground" : ""}`}>{n}</button>
                  ))}
                </div>
              )}
            </div>
          );
          case "h2": return <Field key={b.id} id={b.id} value={b.text} onChange={(v) => set(i, { text: v })} onKeyDown={k} ph="عنوان رئيسي" className="pt-4 text-4xl font-extrabold text-primary" />;
          case "h3": return <Field key={b.id} id={b.id} value={b.text} onChange={(v) => set(i, { text: v })} onKeyDown={k} ph="عنوان فرعي" className="pt-2 text-2xl font-bold text-primary" />;
          case "eq": return <div key={b.id} dir="ltr" className="rounded-xl border-2 border-primary bg-accent py-6 text-center font-mono text-3xl font-bold text-accent-foreground"><Field id={b.id} value={b.text} onChange={(v) => set(i, { text: v })} onKeyDown={k} ph="F = m · a" /></div>;
          case "list": return (
            <ul key={b.id} className="group relative list-disc space-y-1 pr-6">{del(i)}
              {(b.items ?? []).map((v, j) => (
                <li key={j}><Field id={b.id + j} value={v} onChange={(x) => item(j, x)} ph="نقطة"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); const items = [...(b.items ?? [])]; items.splice(j + 1, 0, ""); focusId = b.id + (j + 1); set(i, { items }); }
                    if (e.key === "Backspace" && !v && (b.items?.length ?? 0) > 1) { e.preventDefault(); set(i, { items: b.items!.filter((_, x) => x !== j) }); }
                  }} /></li>
              ))}
            </ul>
          );
          case "qa": return (
            <details key={b.id} className="group relative rounded-xl border border-border bg-card/80 p-5 shadow-sm">{del(i)}
              <summary className="flex list-none flex-wrap items-start justify-between gap-4">
                <Field id={b.id} value={b.text} onChange={(v) => set(i, { text: v })} ph="اكتب السؤال هنا؟" className="flex-1 font-bold" onKeyDown={(e) => e.key === " " && e.stopPropagation()} />
                <span className="shrink-0 cursor-pointer rounded-lg bg-primary px-5 py-2 font-bold text-primary-foreground">الإجابة</span>
              </summary>
              <div className="mt-4 rounded-lg bg-success p-4 text-success-foreground"><Field id={b.id + "a"} value={b.a ?? ""} onChange={(v) => set(i, { a: v })} ph="اكتب الإجابة هنا" /></div>
            </details>
          );
          case "cards": case "compare": return (
            <div key={b.id} className={`group relative grid gap-4 ${b.type === "cards" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>{del(i)}
              {(b.items ?? []).map((v, j) => (
                <div key={j} className={`rounded-xl bg-card p-5 ${b.type === "compare" && j === 0 ? "border-2 border-primary" : "border border-border"}`}>
                  <Field id={b.id + j} value={v} onChange={(x) => item(j, x)} ph={b.type === "cards" ? `بطاقة ${j + 1}` : j ? "الجانب الثاني" : "الجانب الأول"} />
                </div>
              ))}
            </div>
          );
          case "img": return <div key={b.id} className="group relative">{del(i)}<Pic src={b.src} onChange={(src) => set(i, { src })} /></div>;
          case "media": return (
            <figure key={b.id} className="group relative grid items-center gap-4 md:grid-cols-2">{del(i)}
              <Pic src={b.src} onChange={(src) => set(i, { src })} />
              <Field id={b.id} value={b.text} onChange={(v) => set(i, { text: v })} ph="اكتب شرح الصورة هنا" />
            </figure>
          );
          case "section": return (
            <section key={b.id} className="group relative my-6 rounded-3xl border border-border bg-card/60 px-6 py-8 md:px-10">{del(i)}
              <Field id={b.id} value={b.text} onChange={(v) => set(i, { text: v })} ph="عنوان الجدول" className="mb-4 text-3xl font-extrabold text-primary" />
              <Lines blocks={b.children ?? []} onChange={(c) => set(i, { children: c })} />
            </section>
          );
        }
      })}
    </div>
  );
}

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
      if (document.hidden || t - t0 < 66) return;
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

function Lesson() {
  const [blocks, setBlocks] = useState<Block[]>(() => lines(10));
  const last = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const edRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = (html?: string | null) => {
      if (!html?.startsWith("[") || html === last.current) return;
      if (edRef.current?.contains(document.activeElement)) return;
      try { last.current = html; setBlocks(JSON.parse(html)); } catch { /* ignore */ }
    };
    void supabase.from("lesson").select("html").eq("id", "main").maybeSingle().then(({ data }) => apply(data?.html));
    const ch = supabase.channel("lesson-lines").on("postgres_changes", { event: "*", schema: "public", table: "lesson" }, (p) => apply((p.new as { html?: string })?.html)).subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, []);

  const change = (b: Block[]) => {
    setBlocks(b);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const html = JSON.stringify(b);
      if (html === last.current) return;
      last.current = html;
      void supabase.from("lesson").upsert({ id: "main", html, updated_at: new Date().toISOString() });
    }, 700);
  };

  return (
    <>
      <Stars />
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
        <div ref={edRef} className="mx-auto max-w-5xl px-6 py-6 text-lg md:px-10">
          <Lines blocks={blocks} onChange={change} />
        </div>
        <footer className="py-8 text-center text-muted-foreground">إعداد الطالب: فيصل المطيري — فيزياء ٢</footer>
      </main>
    </>
  );
}
