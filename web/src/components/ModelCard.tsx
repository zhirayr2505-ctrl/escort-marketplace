"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { PublicModelRow } from "@/lib/models";

type Props = { model: PublicModelRow; index: number };

function formatMoney(v: string | null): string {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return `$${n}`;
}

export function ModelCard({ model, index }: Props) {
  const cover = model.photos?.[0] ?? null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="app-card-ring flex flex-col overflow-hidden rounded-[1.35rem] border border-app-border/50 bg-app-surface/75 backdrop-blur-md"
    >
      <div className="relative aspect-[3/4] w-full bg-black/40">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- внешние URL из Storage
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-app-muted">
            нет фото
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="truncate text-lg font-semibold tracking-tight text-white drop-shadow-md">
            {model.name}
          </span>
          <span className="shrink-0 rounded-full border border-app-accent/35 bg-black/45 px-2 py-0.5 text-[11px] font-semibold text-app-accent backdrop-blur-sm">
            ★ {Number(model.rating_public ?? 5).toFixed(1)}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 pt-3">
        <p className="text-sm text-app-muted">
          {model.age} лет
          {model.city ? ` · ${model.city}` : ""}
        </p>
        <p className="text-[15px] font-medium text-app-text">
          от <span className="text-app-accent">{formatMoney(model.price_hour)}</span>
          <span className="text-app-muted"> / час</span>
        </p>
        <Link href={`/model/${model.id}`} className="app-btn-primary mt-auto w-full text-center">
          Подробнее
        </Link>
      </div>
    </motion.article>
  );
}
