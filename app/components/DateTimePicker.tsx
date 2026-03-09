"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { tr } from "date-fns/locale";
import { format } from "date-fns";
import WheelPicker from "./WheelPicker";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

type Step = "date" | "time";

interface Props {
  defaultValue?: string; // ISO string: "2026-03-20T18:30:00"
}

export default function DateTimePicker({ defaultValue }: Props) {
  const initDate = defaultValue ? new Date(defaultValue) : undefined;
  const initTime = defaultValue
    ? `${String(new Date(defaultValue).getHours()).padStart(2, "0")}:${String(new Date(defaultValue).getMinutes()).padStart(2, "0")}`
    : "18:00";

  const [selected, setSelected] = useState<Date | undefined>(initDate);
  const [time, setTime] = useState(initTime);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("date");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setStep("date");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const dateValue = selected ? `${format(selected, "yyyy-MM-dd")}T${time}:00` : "";
  const displayText = selected
    ? `${format(selected, "d MMMM yyyy", { locale: tr })} · ${time}`
    : "Tarih ve saat seç";

  function handleDaySelect(day: Date | undefined) {
    setSelected(day);
    if (day) setStep("time");
  }

  function handleOpen() {
    setOpen((v) => !v);
    setStep("date");
  }

  return (
    <div className="relative" ref={ref}>
      <input type="hidden" name="event_date" value={dateValue} />

      <button
        type="button"
        onClick={handleOpen}
        className={`w-full text-left bg-zinc-800 border rounded-lg px-4 py-2.5 transition-colors focus:outline-none ${
          open ? "border-[#e50914]" : "border-zinc-700 hover:border-zinc-500"
        } ${selected ? "text-white" : "text-zinc-500"}`}
      >
        {displayText}
      </button>

      {open && (
        <div className="daypicker-popover absolute z-50 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4">

          {/* ADIM 1: Takvim */}
          {step === "date" && (
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleDaySelect}
              locale={tr}
            />
          )}

          {/* ADIM 2: Saat */}
          {step === "time" && (
            <div className="w-[260px]">
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setStep("date")}
                  className="text-zinc-400 hover:text-white transition-colors text-lg"
                >
                  ←
                </button>
                <span className="text-white font-semibold text-sm">
                  {selected && format(selected, "d MMMM yyyy", { locale: tr })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest text-center mb-1">Saat</p>
                  <WheelPicker
                    items={HOURS}
                    value={time.split(":")[0]}
                    onChange={(h) => setTime(`${h}:${time.split(":")[1]}`)}
                  />
                </div>

                <span className="text-2xl font-bold text-zinc-400 mt-4">:</span>

                <div className="flex-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest text-center mb-1">Dakika</p>
                  <WheelPicker
                    items={MINUTES}
                    value={time.split(":")[1]}
                    onChange={(m) => setTime(`${time.split(":")[0]}:${m}`)}
                  />
                </div>
              </div>

              <p className="text-center text-white font-bold text-lg mt-3">{time}</p>

              <button
                type="button"
                onClick={() => { setOpen(false); setStep("date"); }}
                className="mt-3 w-full bg-[#e50914] hover:bg-[#c40812] text-white text-sm font-semibold py-2 rounded-lg transition-colors"
              >
                Tamam
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
