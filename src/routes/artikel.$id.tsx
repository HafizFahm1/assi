import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const ArtikelDetail = lazy(() =>
  import("@/components/site/ArtikelDetail").then(m => ({ default: m.ArtikelDetail }))
);

function ArtikelDetailRoute() {
  const { id } = Route.useParams();
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ArtikelDetail id={id} />
    </Suspense>
  );
}

export const Route = createFileRoute("/artikel/$id")({
  component: ArtikelDetailRoute,
});