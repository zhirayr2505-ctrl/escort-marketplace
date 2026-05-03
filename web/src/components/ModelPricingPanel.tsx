"use client";

import { useState } from "react";
import type { ModelDetailRow } from "@/lib/models";
import { ModelContactBlock } from "@/components/ModelContactBlock";
import { ModelPriceTabs, type PriceTabId } from "@/components/ModelPriceTabs";

type Props = { model: ModelDetailRow };

export function ModelPricingPanel({ model }: Props) {
  const [tab, setTab] = useState<PriceTabId>("hour");

  const prices: Record<PriceTabId, string | null> = {
    hour: model.price_hour,
    "2hours": model.price_2hours,
    day: model.price_day,
    night: model.price_night,
    self: model.price_self,
    client: model.price_client,
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-app-text">Цены</h2>
        <ModelPriceTabs prices={prices} tab={tab} onTabChange={setTab} />
      </section>
      <ModelContactBlock model={model} selectedTab={tab} />
    </div>
  );
}
