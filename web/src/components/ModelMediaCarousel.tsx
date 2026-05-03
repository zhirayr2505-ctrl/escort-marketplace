"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

type Props = {
  photos: string[];
  videos: string[];
  name: string;
};

export function ModelMediaCarousel({ photos, videos, name }: Props) {
  const items = useMemo(
    () => [
      ...photos.map((src, i) => ({ type: "photo" as const, src, key: `p-${i}` })),
      ...videos.map((src, i) => ({ type: "video" as const, src, key: `v-${i}` })),
    ],
    [photos, videos]
  );

  const [index, setIndex] = useState(0);
  const current = items[index];

  if (items.length === 0) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 dark:bg-neutral-900">
        Нет медиа
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {current.type === "photo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.src} alt="" className="h-full w-full object-cover" />
            ) : (
              <video
                src={current.src}
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
                aria-label={`Видео ${name}`}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === index
                  ? "border-neutral-900 dark:border-neutral-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {item.type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.src} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-white">
                  ▶
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
