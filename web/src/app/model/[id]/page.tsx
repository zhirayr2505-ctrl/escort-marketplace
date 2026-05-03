import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ModelMediaCarousel } from "@/components/ModelMediaCarousel";
import { ModelPricingPanel } from "@/components/ModelPricingPanel";
import { getActiveModelById } from "@/lib/models";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function ModelPage({ params }: Props) {
  const model = await getActiveModelById(params.id);
  if (!model) notFound();

  const photos = model.photos ?? [];
  const videos = model.videos ?? [];

  return (
    <div className="app-shell bg-transparent">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div>
            <ModelMediaCarousel photos={photos} videos={videos} name={model.name} />
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="app-title-gradient text-3xl font-semibold tracking-tight sm:text-4xl">
                  {model.name}
                </h1>
                <span className="rounded-full border border-app-accent/35 bg-app-accent-dim px-2.5 py-0.5 text-sm font-semibold text-app-accent">
                  ★ {Number(model.rating_public ?? 5).toFixed(1)}
                </span>
              </div>
              <p className="mt-3 text-app-muted">
                {model.age} лет
                {model.city ? ` · ${model.city}` : ""}
                {model.nationality ? ` · ${model.nationality}` : ""}
              </p>
            </div>

            {model.description && (
              <section className="rounded-2xl border border-app-border/35 bg-app-surface/55 p-5 backdrop-blur-sm">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-accent/90">
                  О себе
                </h2>
                <p className="mt-3 leading-relaxed text-app-text/95">{model.description}</p>
              </section>
            )}

            {model.preferences && (
              <section className="rounded-2xl border border-app-border/35 bg-app-surface/55 p-5 backdrop-blur-sm">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-accent/90">
                  Предпочтения
                </h2>
                <p className="mt-3 leading-relaxed text-app-text/95">{model.preferences}</p>
              </section>
            )}

            <ModelPricingPanel model={model} />
          </div>
        </div>
      </main>
    </div>
  );
}
