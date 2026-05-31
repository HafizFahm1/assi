import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/training")({
  head: () => ({ meta: [
    { title: "Training & Education — Akademi Soft Skills Indonesia" },
    { name: "description", content: "Kelas online interaktif bersama mentor profesional Indonesia." },
  ]}),
  component: TrainingPage,
});

function TrainingPage() {
  const [q, setQ] = useState("");
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      const { data } = await supabase.from('trainings').select('*').order('created_at', { ascending: false });
      setTrainings(data || []);
      setLoading(false);
    };
    fetchTrainings();
  }, []);

  const list = trainings.filter((t: any) => t.title.toLowerCase().includes(q.toLowerCase()));

  const toProductCard = (t: any) => ({
  id: t.id,
  judul: t.title,
  desc: t.description,
  harga: t.price,
  rating: t.rating,
  badge: t.badge,
  thumb: t.image_url,
  mentor: t.instructor,
  durasi: t.duration,
  tipe: 'training',
});

  return (
    <>
      <PageHeader eyebrow="Training & Education" title="Belajar Soft Skills dari Mentor Terbaik" desc="Kurikulum modern, sertifikat resmi, dan akses selamanya." />
      <section className="mx-auto max-w-7xl px-4 md:px-8 -mt-10">
        <div className="rounded-2xl bg-card border shadow-soft p-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari training..." className="w-full rounded-xl bg-secondary/60 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-[var(--brand-tosca)]" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : list.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada training tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {list.map((t: any, i: number) => (
              <ProductCard key={t.id} p={toProductCard(t)} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}