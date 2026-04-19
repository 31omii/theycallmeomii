"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import type { Drawing } from "@/lib/drawings";

export default function DrawingsClient({ drawings }: { drawings: Drawing[] }) {
  const [activeCollection, setActiveCollection] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  const close = useCallback(() => {
    setActiveCollection(null);
    setActiveImage(0);
    setFullscreen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const prev = useCallback(() => {
    if (activeCollection === null) return;
    if (activeImage > 0) {
      setActiveImage((i) => i - 1);
    } else {
      const prevCol = (activeCollection - 1 + drawings.length) % drawings.length;
      setActiveCollection(prevCol);
      setActiveImage(drawings[prevCol].images.length - 1);
    }
  }, [activeCollection, activeImage, drawings]);

  const next = useCallback(() => {
    if (activeCollection === null) return;
    const total = drawings[activeCollection].images.length;
    if (activeImage < total - 1) {
      setActiveImage((i) => i + 1);
    } else {
      const nextCol = (activeCollection + 1) % drawings.length;
      setActiveCollection(nextCol);
      setActiveImage(0);
    }
  }, [activeCollection, activeImage, drawings]);

  useEffect(() => {
    if (activeCollection === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreen) closeFullscreen();
        else close();
      }
      if (!fullscreen) {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [activeCollection, close, closeFullscreen, prev, next, fullscreen]);

  useEffect(() => {
    document.body.style.overflow = activeCollection !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeCollection]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(5, Math.max(1, z - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan({
      x: panStart.current.x + (e.clientX - dragStart.current.x),
      y: panStart.current.y + (e.clientY - dragStart.current.y),
    });
  };
  const handleMouseUp = () => { isDragging.current = false; };

  const current = activeCollection !== null ? drawings[activeCollection] : null;
  const currentImage = current ? current.images[activeImage] : null;
  const isMulti = current ? current.images.length > 1 : false;

  const renderDots = (total: number, active: number) => {
    if (total <= 10) {
      return (
        <div className="flex gap-1 items-center">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
              className={`rounded-full transition-all duration-200 ${
                i === active ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      );
    }
    return <span className="text-zinc-500 text-xs">{active + 1} / {total}</span>;
  };

  return (
    <>
      {/* Grid */}
      <div className="py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {drawings.map((drawing, i) => (
            <button
              key={drawing.slug}
              onClick={() => { setActiveCollection(i); setActiveImage(0); }}
              className="group flex flex-col gap-2 text-left"
            >
              <div className="relative w-full aspect-square">
                {drawing.images.length > 1 && (
                  <>
                    <div className="absolute inset-0 rounded-xl border border-zinc-700 bg-zinc-800/60 rotate-2 origin-bottom" />
                    <div className="absolute inset-0 rounded-xl border border-zinc-700/50 bg-zinc-900/40 rotate-1 origin-bottom" />
                  </>
                )}
                <div className="absolute inset-0 rounded-xl overflow-hidden border border-zinc-800 group-hover:border-zinc-600 transition-all duration-300">
                  {drawing.images[0] && (
                    <img
                      src={drawing.images[0].src}
                      alt={drawing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-medium group-hover:text-zinc-200 transition-colors">
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

      {/* Fullscreen */}
      {fullscreen && currentImage && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xl"
            onClick={closeFullscreen}
          />
          <button
            onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
            className="absolute top-4 right-4 z-10000 text-zinc-500 hover:text-white transition-colors"
          >
            <XIcon size={18} />
          </button>

          {/* left arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 z-10000 text-zinc-500 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded-sm p-2"
          >
            <ArrowLeftIcon size={16} />
          </button>

          {/* right arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 z-10000 text-zinc-500 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded-sm p-2"
          >
            <ArrowRightIcon size={16} />
          </button>

          <div
            className="relative z-10000 w-full max-w-5xl max-h-[95vh] rounded-xl overflow-hidden border border-zinc-800/40 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1 ? "grabbing" : "default" }}
          >
            <img
              src={currentImage.src}
              alt={currentImage.caption}
              draggable={false}
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: isDragging.current ? "none" : "transform 0.15s ease",
                maxWidth: "100%",
                maxHeight: "95vh",
                objectFit: "contain",
                display: "block",
                userSelect: "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Lightbox */}
      {current && currentImage && activeCollection !== null && !fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md" />
          <div
            className="relative z-10 flex gap-3 w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="absolute -top-9 right-0 z-20 text-zinc-400 hover:text-white transition-colors"
            >
              <XIcon size={18} />
            </button>

            <div className="flex flex-col flex-1 gap-3 min-w-0">
              <div
                className="w-full rounded-xl overflow-hidden border border-zinc-800 h-[55vh] flex items-center justify-center bg-zinc-950/50 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
              >
                <img
                  src={currentImage.src}
                  alt={currentImage.caption}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-white text-sm font-medium">{current.title}</p>
                  {current.description && (
                    <p className="text-zinc-400 text-xs leading-relaxed">{current.description}</p>
                  )}
                  {currentImage.caption && (
                    <p className="text-zinc-500 text-xs italic mt-0.5">{currentImage.caption}</p>
                  )}
                </div>
                <p className="text-zinc-500 text-xs shrink-0">{current.date}</p>
              </div>

              <div className="flex gap-3 w-full justify-center items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded-sm px-4 py-1.5 flex items-center gap-2 text-sm"
                >
                  <ArrowLeftIcon size={13} /> prev
                </button>
                <div className="flex flex-col items-center gap-1 min-w-60px justify-center">
                  {isMulti && renderDots(current.images.length, activeImage)}
                  <span className="text-zinc-600 text-xs">
                    {activeCollection + 1} / {drawings.length}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded-sm px-4 py-1.5 flex items-center gap-2 text-sm"
                >
                  next <ArrowRightIcon size={13} />
                </button>
              </div>
            </div>

            {isMulti && (
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[70vh] w-14 shrink-0">
                {current.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border transition-all duration-150 ${
                      idx === activeImage
                        ? "border-white opacity-100"
                        : "border-zinc-800 hover:border-zinc-500 opacity-40 hover:opacity-100"
                    }`}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}