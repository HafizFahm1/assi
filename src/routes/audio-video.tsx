import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/audio-video")({
  head: () => ({ meta: [
    { title: "Audio & Video — Akademi Soft Skills Indonesia" },
    { name: "description", content: "Podcast, audio motivasi, dan video pembelajaran inspiratif." },
  ]}),
  component: AVPage,
});

function AVPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from('audio_videos').select('*').order('created_at', { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const toProductCard = (item: any) => ({
    id: item.id,
    judul: item.title,
    deskripsi: item.description,
    harga: item.price,
    rating: item.rating,
    badge: item.badge,
    gambar: item.image_url,
    tipe: 'audio-video',
  });

  return (
    <>
      <PageHeader eyebrow="Media Learning" title="Audio & Video Inspiratif" desc="Podcast, motivasi, dan video pembelajaran kapan saja." />
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada konten tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item: any, i: number) => (
              <ProductCard key={item.id} p={toProductCard(item)} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}