"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-3">
      <TimeBox value={timeLeft.days} label="GÜN" />
      <Separator />
      <TimeBox value={timeLeft.hours} label="SAAT" />
      <Separator />
      <TimeBox value={timeLeft.minutes} label="DAKİKA" />
      <Separator />
      <TimeBox value={timeLeft.seconds} label="SANİYE" />
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black tabular-nums text-white leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-zinc-400 mt-1 tracking-widest">{label}</span>
    </div>
  );
}

function Separator() {
  return <span className="text-2xl font-bold text-[#e50914] mb-3">:</span>;
}
