"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import type { Drawing } from "@/lib/drawings";

// flatten all images across all collections into one list
type FlatImage = {
  src: string;
  caption: string;
  collectionTitle: string;
  collectionDate: string;
  collectionDescription: string;
  isMulti: boolean;
  indexInCollection: number;
  totalInCollection: number;
};

function flatten(drawings: Drawing[]): FlatImage[] {
  const result: FlatImage[] = [];
  for (const d of drawings) {
    for (let i = 0; i < d.images.length; i++) {
      result.push({
        src: d.images[i].src,
        caption: d.images[i].caption,
        collectionTitle: d.title,
        collectionDate: d.date,
        collectionDescription: d.description,
        isMulti: d.images.length > 1,
        indexInCollection: i,
        totalInCollection: d.images.length,
      });
    }
  }
  return result;
}

export default function DrawingsClient({ drawings }: { drawings: Drawing[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const flat = flatten(drawings);

  const close = useCallback(() => setActiveIndex(null), []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + flat.length) % flat.length));
  }, [flat.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % flat.length));
  }, [flat.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [activeIndex, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  // find the flat index of first image in a collection
  const getCollectionStartIndex = (collectionIndex: number) => {
    let count = 0;
    for (let i = 0; i < collectionIndex; i++) {
      count += drawings[i].images.length;
    }
    return count;
  };

  const current = activeIndex !== null ? flat[activeIndex] : null;

  return (
    <>
      {/* Grid */}
      <div className="py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {drawings.map((drawing, i) => (
            <button
              key={drawing.slug}
              onClick={() => setActiveIndex(getCollectionStartIndex(i))}
              className="group flex flex-col gap-2 text-left"
            >
              <div className="aspect-square rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors w-full">
                {drawing.images[0] && (
                  <img
                    src={drawing.images[0].src}
                    alt={drawing.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div>
                <p className="text-white text-sm group-hover:text-zinc-200 transition-colors font-medium">
                  {drawing.title}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {drawing.images.length > 1
                    ? `${drawing.images.length} drawings · ${drawing.date}`
                    : drawing.date}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {current && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
          onClick={close}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md" />

          {/* content */}
          <div
            className="relative z-10 flex flex-col items-center max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button
              onClick={close}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-white transition-colors"
            >
              <XIcon size={20} />
            </button>

            {/* image */}
            <div className="w-full rounded-lg overflow-hidden border border-zinc-800">
              <img
                src={current.src}
                alt={current.caption}
                className="w-full h-auto object-contain max-h-[60vh]"
              />
            </div>

            {/* info */}
            <div className="w-full mt-4 flex flex-col gap-1">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-white text-sm font-medium">
                    {current.collectionTitle}
                    {current.isMulti && (
                      <span className="text-zinc-500 font-normal ml-2 text-xs">
                        {current.indexInCollection + 1} / {current.totalInCollection}
                      </span>
                    )}
                  </p>
                  {current.collectionDescription && (
                    <p className="text-zinc-400 text-xs">{current.collectionDescription}</p>
                  )}
                  {current.caption && (
                    <p className="text-zinc-500 text-xs italic mt-0.5">{current.caption}</p>
                  )}
                </div>
                <p className="text-zinc-500 text-xs shrink-0">{current.collectionDate}</p>
              </div>
            </div>

            {/* nav — fixed position always */}
            <div className="flex gap-4 mt-6 w-full justify-center">
              <button
                onClick={prev}
                className="text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded-sm px-5 py-2 flex items-center gap-2 text-sm"
              >
                <ArrowLeftIcon size={14} /> prev
              </button>
              <span className="text-zinc-500 text-xs self-center">
                {activeIndex + 1} / {flat.length}
              </span>
              <button
                onClick={next}
                className="text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded-sm px-5 py-2 flex items-center gap-2 text-sm"
              >
                next <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}