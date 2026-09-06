"use client";

import { SurfaceCard } from "@/components/common/SurfaceCard";
import {
  bandDescriptor,
  listeningBand,
  overallBand,
  readingBand,
} from "@/features/ielts/data";
import { cn } from "@/lib/utils";
import { useState } from "react";

function bandColor(band: number): string {
  if (band >= 7.5) return "text-emerald-500";
  if (band >= 6.5) return "text-sky-500";
  if (band >= 5.5) return "text-amber-500";
  return "text-rose-500";
}

function BandRing({ band }: { band: number }) {
  const radius = 84;
  const stroke = 14;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const pct = Math.max(0, Math.min(1, band / 9));
  const offset = circumference * (1 - pct);

  return (
    <div className="relative flex size-[168px] items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
        role="img"
        aria-label={`Estimated band score ${band.toFixed(1)} of 9`}
      >
        <circle
          className="text-muted"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={cn(
            "transition-[stroke-dashoffset] duration-700 ease-out",
            bandColor(band)
          )}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums">{band.toFixed(1)}</span>
        <span className="text-xs font-medium text-muted-foreground">Overall band</span>
      </div>
    </div>
  );
}

function ScoreSlider({
  label,
  value,
  max,
  step,
  displayValue,
  bandValue,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  step: number;
  displayValue: string;
  bandValue: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">{displayValue}</span>
          <span
            className={cn(
              "rounded-4xl bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums",
              bandColor(bandValue)
            )}
          >
            Band {bandValue.toFixed(1)}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label={label}
      />
    </div>
  );
}

export function BandScoreCalculator() {
  const [reading, setReading] = useState(30);
  const [listening, setListening] = useState(30);
  const [writing, setWriting] = useState(6.5);
  const [speaking, setSpeaking] = useState(6.5);

  const rBand = readingBand(reading);
  const lBand = listeningBand(listening);
  const overall = overallBand([rBand, lBand, writing, speaking]);

  return (
    <SurfaceCard className="p-6">
      <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex flex-col items-center gap-2">
          <BandRing band={overall} />
          <p className="text-sm font-medium">{bandDescriptor(overall)}</p>
        </div>

        <div className="space-y-5">
          <ScoreSlider
            label="Reading — correct answers"
            value={reading}
            max={40}
            step={1}
            displayValue={`${reading} / 40`}
            bandValue={rBand}
            onChange={setReading}
          />
          <ScoreSlider
            label="Listening — correct answers"
            value={listening}
            max={40}
            step={1}
            displayValue={`${listening} / 40`}
            bandValue={lBand}
            onChange={setListening}
          />
          <ScoreSlider
            label="Writing — self-assessed band"
            value={writing}
            max={9}
            step={0.5}
            displayValue={writing.toFixed(1)}
            bandValue={writing}
            onChange={setWriting}
          />
          <ScoreSlider
            label="Speaking — self-assessed band"
            value={speaking}
            max={9}
            step={0.5}
            displayValue={speaking.toFixed(1)}
            bandValue={speaking}
            onChange={setSpeaking}
          />

          <p className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
            Overall band is the average of all four skills, rounded to the nearest
            half-band using official IELTS rounding (e.g. 6.25 → 6.5).
          </p>
        </div>
      </div>
    </SurfaceCard>
  );
}
