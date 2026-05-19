import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [
    { title: "Book — Akademi Soft Skills Indonesia" },
    { name: "description", content: "Marketplace eBook premium untuk pengembangan diri profesional." },
  ]}),
  component: BookPage,
});

function BookPage() {
  const [q, setQ] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      setBooks(data || []);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const list = books.filter((b: any) => b.title.toLowerCase().includes(q.toLowerCase()));

  const toProductCard = (b: any) => ({
    id: b.id,
    judul: b.title,
    deskripsi: b.description,
    harga: b.price,
    rating: b.rating,
    badge: b.badge,
    gambar: b.image_url,
    tipe: 'book',
  });

  return (
    <>
      <PageHeader eyebrow="Marketplace eBook" title="Book Premium untuk Profesional" desc="Cover 3D, harga terjangkau, kualitas dunia." />
      <section className="mx-auto max-w-7xl px-4 md:px-8 -mt-10">
        <div className="rounded-2xl bg-card border shadow-soft p-4 max-w-xl mx-auto relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari buku..." className="w-full rounded-xl bg-secondary/60 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-[var(--brand-tosca)]" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : list.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada buku tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {list.map((b: any, i: number) => (
              <ProductCard key={b.id} p={toProductCard(b)} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}