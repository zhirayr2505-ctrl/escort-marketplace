"use client";

import type { ModelDetailRow } from "@/lib/models";
import type { PriceTabId } from "@/components/ModelPriceTabs";

type Props = {
  model: ModelDetailRow;
  selectedTab: PriceTabId;
};

function depositAmount(model: ModelDetailRow, tab: PriceTabId): number {
  const map: Record<PriceTabId, string | null> = {
    hour: model.price_hour,
    "2hours": model.price_2hours,
    day: model.price_day,
    night: model.price_night,
    self: model.price_self,
    client: model.price_client,
  };
  const base = Number(map[tab] ?? 0);
  if (Number.isNaN(base)) return 0;
  return Math.round((base * model.deposit_percent) / 100);
}

export function ModelContactBlock({ model, selectedTab }: Props) {
  const isPublic = model.privacy_contacts === "public";
  const deposit = depositAmount(model, selectedTab);

  if (isPublic) {
    return (
      <div className="space-y-4 rounded-2xl border border-app-border/40 bg-app-surface/60 p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-app-text">Контакты</h3>
        <div className="flex flex-col gap-2 text-sm">
          {model.contacts_telegram && (
            <a
              href={`https://t.me/${model.contacts_telegram.replace(/^@/, "")}`}
              className="rounded-xl bg-[#229ED9] px-4 py-2.5 text-center font-semibold text-white shadow-lg shadow-[#229ED9]/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
          )}
          {model.contacts_whatsapp && (
            <a
              href={`https://wa.me/${model.contacts_whatsapp.replace(/\D/g, "")}`}
              className="rounded-xl bg-[#25D366] px-4 py-2.5 text-center font-semibold text-white shadow-lg shadow-[#25D366]/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          )}
          {model.contacts_phone && (
            <a
              href={`tel:${model.contacts_phone}`}
              className="rounded-xl border border-app-border/45 bg-app-bg/40 py-2.5 text-center font-medium text-app-text"
            >
              {model.contacts_phone}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-app-accent/30 bg-app-accent-dim p-5">
      <h3 className="text-sm font-semibold text-app-accent">Контакты по залогу</h3>
      <p className="mt-2 text-sm leading-relaxed text-app-muted">
        Модель открывает контакты после подтверждения залога{" "}
        <strong className="text-app-text">{model.deposit_percent}%</strong> от выбранной цены (ориентир ~$
        {deposit} USDT).
      </p>
      <button
        type="button"
        disabled
        className="mt-4 w-full cursor-not-allowed rounded-xl border border-app-border/35 bg-app-surface/40 py-3 text-sm font-medium text-app-muted opacity-70"
      >
        Получить контакты (скоро)
      </button>
    </div>
  );
}
