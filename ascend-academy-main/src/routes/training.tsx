import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { TRAINING } from "@/lib/site-data";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/training")({
  head: () => ({ meta: [
    { title: "Training & Education — Akademi Soft Skills Indonesia" },
    { name: "description", content: "Kelas online interaktif bersama mentor profesional Indonesia." },
  ]}),
  component: TrainingPage,
});

const LEVELS = ["Semua", "Beginner", "Intermediate", "Advanced"];

function TrainingPage() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("Semua");
  const list = TRAINING.filter(t =>
    (level === "Semua" || t.level === level) &&
    t.judul.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHeader eyebrow="Training & Education" title="Belajar Soft Skills dari Mentor Terbaik" desc="Kurikulum modern, sertifikat resmi, dan akses selamanya." />
      <section className="mx-auto max-w-7xl px-4 md:px-8 -mt-10">
        <div className="rounded-2xl bg-card border shadow-soft p-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari training..." className="w-full rounded-xl bg-secondary/60 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-[var(--brand-tosca)]" />
          </div>
          <div className="flex gap-2">
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${level === l ? "gradient-tosca text-white shadow-soft" : "bg-secondary text-muted-foreground hover:text-[var(--brand-navy)]"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((p, i) => (<ProductCard key={p.id} p={p} index={i} />))}
        </div>
      </section>
    </>
  );
}
