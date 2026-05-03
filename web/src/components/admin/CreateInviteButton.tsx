"use client";

import { useState } from "react";

type CreateFn = () => Promise<{ ok?: boolean; url?: string; error?: string }>;

export function CreateInviteButton({ createAction }: { createAction: CreateFn }) {
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setErr(null);
    setUrl(null);
    setLoading(true);
    try {
      const r = await createAction();
      if (r.error) setErr(r.error);
      else if (r.url) setUrl(r.url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {loading ? "Создание…" : "Создать инвайт-ссылку"}
      </button>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {url && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm dark:border-green-900/50 dark:bg-green-950/30">
          <p className="font-medium text-green-900 dark:text-green-100">Ссылка скопируй в буфер:</p>
          <p className="mt-1 break-all font-mono text-xs text-green-800 dark:text-green-200">{url}</p>
        </div>
      )}
    </div>
  );
}
