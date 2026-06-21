"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const baseCols = ["grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4"];
const smCols = ["", "sm:grid-cols-1", "sm:grid-cols-2", "sm:grid-cols-3", "sm:grid-cols-4"];
const mdCols = ["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4"];
const lgCols = ["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"];
const gapOptions = ["gap-0", "gap-2", "gap-4", "gap-8"];

export default function GridSection() {
  const [baseIdx, setBaseIdx] = useState(0);
  const [smIdx, setSmIdx] = useState(0);
  const [mdIdx, setMdIdx] = useState(0);
  const [lgIdx, setLgIdx] = useState(0);
  const [gapIdx, setGapIdx] = useState(2);

  const gridClass = useMemo(
    () =>
      cn([
        "grid rounded-lg border border-gray-300 bg-white p-8 transition-all",
        baseCols[baseIdx],
        smCols[smIdx],
        mdCols[mdIdx],
        lgCols[lgIdx],
        gapOptions[gapIdx],
      ]),
    [baseIdx, smIdx, mdIdx, lgIdx, gapIdx]
  );

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">2. Siatki: grid-cols + gap</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Control label="Base" options={baseCols} value={baseIdx} onChange={setBaseIdx} />
        <Control label="sm" options={smCols.map(labelOrNone)} value={smIdx} onChange={setSmIdx} />
        <Control label="md" options={mdCols.map(labelOrNone)} value={mdIdx} onChange={setMdIdx} />
        <Control label="lg" options={lgCols.map(labelOrNone)} value={lgIdx} onChange={setLgIdx} />
        <Control label="Gap" options={gapOptions} value={gapIdx} onChange={setGapIdx} />
      </div>

      <div className={gridClass}>
        <Cell>A</Cell>
        <Cell>B</Cell>
        <Cell>C</Cell>
        <Cell>D</Cell>
        <Cell>E</Cell>
        <Cell>F</Cell>
      </div>

      <ClassPreview title="Aktualne klasy siatki" value={gridClass} />
    </section>
  );
}

function labelOrNone(v: string) {
  return v === "" ? "(brak)" : v;
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-main-soft bg-main-soft px-3 py-4 text-center font-semibold text-main">
      {children}
    </div>
  );
}

function Control({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: number;
  onChange: (idx: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <select
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((option, idx) => (
          <option key={option + idx} value={idx}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ClassPreview({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-xs text-gray-800 break-words">{value}</p>
    </div>
  );
}