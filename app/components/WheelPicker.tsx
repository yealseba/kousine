"use client";

import { useRef, useEffect, useCallback } from "react";

const ITEM_HEIGHT = 40;
const VISIBLE = 5;

interface Props {
  items: string[];
  value: string;
  onChange: (val: string) => void;
}

export default function WheelPicker({ items, value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);         // mevcut piksel offset
  const dragStartY = useRef(0);
  const dragStartOffset = useRef(0);
  const isDragging = useRef(false);
  const velocityRef = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const rafRef = useRef<number | null>(null);

  const clampOffset = useCallback(
    (offset: number) => Math.max(0, Math.min(offset, (items.length - 1) * ITEM_HEIGHT)),
    [items.length]
  );

  const applyOffset = useCallback((offset: number) => {
    offsetRef.current = offset;
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(${-offset}px)`;
    }
  }, []);

  const snapToNearest = useCallback(() => {
    const idx = Math.round(offsetRef.current / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    const target = clamped * ITEM_HEIGHT;

    // Smooth snap animasyonu
    const start = offsetRef.current;
    const diff = target - start;
    const duration = 180;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      applyOffset(start + diff * ease);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        applyOffset(target);
        onChange(items[clamped]);
      }
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, [items, applyOffset, onChange]);

  const momentumScroll = useCallback(() => {
    if (Math.abs(velocityRef.current) < 0.5) {
      snapToNearest();
      return;
    }
    velocityRef.current *= 0.92; // sürtünme
    applyOffset(clampOffset(offsetRef.current + velocityRef.current));
    rafRef.current = requestAnimationFrame(momentumScroll);
  }, [applyOffset, clampOffset, snapToNearest]);

  // Değer değişince scroll et
  useEffect(() => {
    const idx = items.indexOf(value);
    if (idx >= 0) applyOffset(idx * ITEM_HEIGHT);
  }, [value, items, applyOffset]);

  // Mouse events
  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartOffset.current = offsetRef.current;
    lastY.current = e.clientY;
    lastTime.current = performance.now();
    velocityRef.current = 0;
  }

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      const dy = e.clientY - dragStartY.current;
      applyOffset(clampOffset(dragStartOffset.current - dy));
      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) velocityRef.current = (lastY.current - e.clientY) / dt * 16;
      lastY.current = e.clientY;
      lastTime.current = now;
    }
    function onMouseUp() {
      if (!isDragging.current) return;
      isDragging.current = false;
      rafRef.current = requestAnimationFrame(momentumScroll);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [applyOffset, clampOffset, momentumScroll]);

  // Touch events
  function onTouchStart(e: React.TouchEvent) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isDragging.current = true;
    dragStartY.current = e.touches[0].clientY;
    dragStartOffset.current = offsetRef.current;
    lastY.current = e.touches[0].clientY;
    lastTime.current = performance.now();
    velocityRef.current = 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    applyOffset(clampOffset(dragStartOffset.current - dy));
    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) velocityRef.current = (lastY.current - e.touches[0].clientY) / dt * 16;
    lastY.current = e.touches[0].clientY;
    lastTime.current = now;
  }

  function onTouchEnd() {
    isDragging.current = false;
    rafRef.current = requestAnimationFrame(momentumScroll);
  }

  const centerIdx = items.indexOf(value);

  return (
    <div
      className="relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ height: ITEM_HEIGHT * VISIBLE }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Üst fade */}
      <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: ITEM_HEIGHT * 2, background: "linear-gradient(to bottom, #18181b 20%, transparent)" }} />

      {/* Alt fade */}
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: ITEM_HEIGHT * 2, background: "linear-gradient(to top, #18181b 20%, transparent)" }} />

      {/* Seçim çizgileri */}
      <div className="absolute inset-x-0 z-10 pointer-events-none border-y border-zinc-600"
        style={{ top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT }} />

      {/* Items */}
      <div
        ref={containerRef}
        className="absolute inset-x-0"
        style={{ top: ITEM_HEIGHT * 2, willChange: "transform" }}
      >
        {items.map((item, i) => (
          <div
            key={item}
            style={{ height: ITEM_HEIGHT }}
            className={`flex items-center justify-center text-base font-medium transition-colors duration-100 ${
              i === centerIdx ? "text-white" : "text-zinc-500"
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
