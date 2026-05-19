import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { BOOKS } from "@/lib/site-data";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [
    { title: "Book — Akademi Soft Skills Indonesia" },
    { name: "description", content: "Marketplace eBook premium untuk pengembangan diri profesional." },
  ]}),
  component: BookPage,
});

function BookPage() {
  const [q, setQ] = useState("");
  const list = BOOKS.filter(b => b.judul.toLowerCase().includes(q.toLowerCase()));
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {list.map((p, i) => (<ProductCard key={p.id} p={p} index={i} />))}
        </div>
      </section>
    </>
  );
}
