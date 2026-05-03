"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export type PriceTabId = "hour" | "2hours" | "day" | "night" | "self" | "client";

const TABS: { id: PriceTabId; label: string }[] = [
  { id: "hour", label: "Час" },
  { id: "2hours", label: "2 часа" },
  { id: "day", label: "День" },
  { id: "night", label: "Ночь" },
  { id: "self", label: "У себя" },
  { id: "client", label: "У тебя" },
];

function formatPrice(v: string | null): string {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return `$${n}`;
}

type Props = {
  prices: Record<PriceTabId, string | null>;
  tab?: PriceTabId;
  onTabChange?: (t: PriceTabId) => void;
};

export function ModelPriceTabs({ prices, tab: controlledTab, onTabChange }: Props) {
  const [innerTab, setInnerTab] = useState<PriceTabId>("hour");
  const tab = controlledTab ?? innerTab;
  const setTab = (t: PriceTabId) => {
    onTabChange?.(t);
    if (controlledTab === undefined) setInnerTab(t);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              tab === t.id
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100"
      >
        {formatPrice(prices[tab])}
      </motion.div>
    </div>
  );
}
