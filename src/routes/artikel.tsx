import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/artikel")({
  head: () => ({ meta: [
    { title: "Artikel — Akademi Soft Skills Indonesia" },
    { name: "description", content: "Baca ribuan artikel edukatif terbaru tentang komunikasi, leadership, dan karier." },
  ]}),
  component: ArtikelPage,
});

const KATS = ["Semua", "Komunikasi", "Karier", "Public Speaking", "Mindset", "Produktivitas", "Leadership"];

function ArtikelPage() {
  const [q, setQ] = useState("");
  const [kat, setKat] = useState("Semua");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase.from('articles').select('*').order('published_at', { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const list = articles.filter((a: any) =>
    (kat === "Semua" || a.category === kat) &&
    a.title.toLowerCase().includes(q.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <>
      <PageHeader eyebrow="Artikel & Insight" title="Pelajari Hal Baru Setiap Hari" desc="Ribuan artikel edukatif terbaru untuk mengembangkan diri." />
      <section className="mx-auto max-w-7xl px-4 md:px-8 -mt-10">
        <div className="rounded-2xl bg-card border shadow-soft p-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari artikel..." className="w-full rounded-xl bg-secondary/60 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-[var(--brand-tosca)]" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {KATS.map(k => (
              <button key={k} onClick={() => setKat(k)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${kat === k ? "gradient-orange text-white shadow-soft" : "bg-secondary text-muted-foreground hover:text-[var(--brand-navy)]"}`}>
                {k}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : list.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">Tidak ada artikel ditemukan.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((a: any, i: number) => (
              <Link to="/artikel/$id" params={{ id: a.id }} key={a.id} className="block" style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
                <motion.article
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-3xl bg-card border border-border/60 shadow-soft overflow-hidden hover:shadow-elegant transition-all cursor-pointer">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {a.image_url ? (
                      <img src={a.image_url} alt={a.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-110 duration-700" />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">No Image</div>
                    )}
                    {a.category && <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[var(--brand-navy)]">{a.category}</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[var(--brand-navy)] line-clamp-2 leading-snug">{a.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{a.author || '-'}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(a.published_at)}</span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}