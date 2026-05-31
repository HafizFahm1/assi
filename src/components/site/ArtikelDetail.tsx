import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function ArtikelDetail({ id }: { id: string }) {
  const [artikel, setArtikel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtikel = async () => {
      const { data } = await supabase.from('articles').select('*').eq('id', id).single();
      setArtikel(data);
      setLoading(false);
    };
    fetchArtikel();
  }, [id]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!artikel) return <div className="min-h-screen flex items-center justify-center text-gray-400">Artikel tidak ditemukan.</div>;

  return (
    <section className="mx-auto max-w-3xl px-4 md:px-8 py-12">
      <Link to="/artikel" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--brand-navy)] mb-8">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Artikel
      </Link>
      {artikel.image_url && (
        <img src={artikel.image_url} alt={artikel.title} className="w-full rounded-3xl aspect-video object-cover mb-8" />
      )}
      {artikel.category && (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-navy)] text-white">{artikel.category}</span>
      )}
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--brand-navy)] leading-snug">{artikel.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        {artikel.author && <span className="flex items-center gap-1"><User className="h-4 w-4" />{artikel.author}</span>}
        {artikel.published_at && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(artikel.published_at)}</span>}
      </div>
      {artikel.excerpt && (
        <p className="mt-6 text-lg text-muted-foreground border-l-4 border-[var(--brand-orange)] pl-4 italic">{artikel.excerpt}</p>
      )}
      <div className="mt-8 text-foreground whitespace-pre-wrap leading-relaxed">
        {artikel.content || <p className="text-muted-foreground">Konten artikel belum tersedia.</p>}
      </div>
    </section>
  );
}