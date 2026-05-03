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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="relative aspect-[3/4] w-full bg-neutral-100 dark:bg-neutral-900">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- внешние URL из Storage без белого списка в next.config
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            нет фото
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
            {model.name}
          </h2>
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
            ★ {Number(model.rating_public ?? 5).toFixed(1)}
          </span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {model.age} лет
          {model.city ? ` · ${model.city}` : ""}
        </p>
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          от {formatMoney(model.price_hour)} / час
        </p>
        <Link
          href={`/model/${model.id}`}
          className="mt-auto inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          Подробнее
        </Link>
      </div>
    </motion.article>
  );
}
