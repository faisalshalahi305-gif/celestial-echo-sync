import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import cover from "@/assets/space-cover.jpg";

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

function Lesson() {
  return (
    <>
      <Stars />
      <main className="min-h-screen text-foreground">
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
        <footer className="py-8 text-center text-muted-foreground">إعداد الطالب: فيصل المطيري — فيزياء ٢</footer>
      </main>
    </>
  );
}
