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
      <div className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Контакты</h3>
        <div className="flex flex-col gap-2 text-sm">
          {model.contacts_telegram && (
            <a
              href={`https://t.me/${model.contacts_telegram.replace(/^@/, "")}`}
              className="rounded-xl bg-[#229ED9] px-4 py-2.5 text-center font-medium text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
          )}
          {model.contacts_whatsapp && (
            <a
              href={`https://wa.me/${model.contacts_whatsapp.replace(/\D/g, "")}`}
              className="rounded-xl bg-[#25D366] px-4 py-2.5 text-center font-medium text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          )}
          {model.contacts_phone && (
            <a href={`tel:${model.contacts_phone}`} className="rounded-xl border border-neutral-300 py-2.5 text-center dark:border-neutral-600">
              {model.contacts_phone}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
      <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-100">Контакты по залогу</h3>
      <p className="mt-1 text-sm text-amber-900/90 dark:text-amber-200/90">
        Модель открывает контакты после подтверждения залога{" "}
        <strong>{model.deposit_percent}%</strong> от выбранной цены (сейчас ориентир ~${deposit} USDT за выбранный
        период).
      </p>
      <button
        type="button"
        disabled
        className="mt-3 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
      >
        Получить контакты (скоро: оплата и скриншот)
      </button>
    </div>
  );
}
