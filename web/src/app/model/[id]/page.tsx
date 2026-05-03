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
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div>
            <ModelMediaCarousel photos={photos} videos={videos} name={model.name} />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{model.name}</h1>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
                  ★ {Number(model.rating_public ?? 5).toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                {model.age} лет
                {model.city ? ` · ${model.city}` : ""}
                {model.nationality ? ` · ${model.nationality}` : ""}
              </p>
            </div>

            {model.description && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">О себе</h2>
                <p className="mt-2 text-neutral-800 dark:text-neutral-200">{model.description}</p>
              </section>
            )}

            {model.preferences && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Предпочтения</h2>
                <p className="mt-2 text-neutral-800 dark:text-neutral-200">{model.preferences}</p>
              </section>
            )}

            <ModelPricingPanel model={model} />
          </div>
        </div>
      </main>
    </div>
  );
}
