import { createFileRoute } from "@tanstack/react-router";
import { AUDIO_VIDEO } from "@/lib/site-data";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/audio-video")({
  head: () => ({ meta: [
    { title: "Audio & Video — Akademi Soft Skills Indonesia" },
    { name: "description", content: "Podcast, audio motivasi, dan video pembelajaran inspiratif." },
  ]}),
  component: AVPage,
});

function AVPage() {
  return (
    <>
      <PageHeader eyebrow="Media Learning" title="Audio & Video Inspiratif" desc="Podcast, motivasi, dan video pembelajaran kapan saja." />
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AUDIO_VIDEO.map((p, i) => (<ProductCard key={p.id} p={p} index={i} />))}
        </div>
      </section>
    </>
  );
}
