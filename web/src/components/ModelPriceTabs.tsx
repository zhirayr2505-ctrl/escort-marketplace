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
      <div className="flex flex-wrap gap-2 border-b border-app-border/35 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              tab === t.id
                ? "border border-app-accent/45 bg-app-accent-dim text-app-accent shadow-app-glow"
                : "border border-transparent text-app-muted hover:border-app-border/40 hover:bg-app-surface/60 hover:text-app-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 text-3xl font-semibold tracking-tight text-app-text"
      >
        <span className="text-app-accent">{formatPrice(prices[tab])}</span>
      </motion.div>
    </div>
  );
}
