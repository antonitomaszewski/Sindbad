"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const widthOptions = ["w-32", "w-48", "w-72", "w-full"];
const smWidthOptions = ["", "sm:w-40", "sm:w-64", "sm:w-full"];
const mdWidthOptions = ["", "md:w-48", "md:w-80", "md:w-full"];
const lgWidthOptions = ["", "lg:w-56", "lg:w-96", "lg:w-full"];

const minWidthOptions = ["min-w-0", "min-w-[180px]", "min-w-[260px]"];
const maxWidthOptions = ["max-w-none", "max-w-xs", "max-w-sm", "max-w-md"];

const heightOptions = ["h-20", "h-32", "h-64", "h-auto"];
const minHeightOptions = ["min-h-0", "min-h-[120px]", "min-h-[200px]"];
const maxHeightOptions = ["max-h-none", "max-h-24", "max-h-40", "max-h-64"];

export default function SizeSection() {
  const [wIdx, setWIdx] = useState(1);
  const [smWIdx, setSmWIdx] = useState(0);
  const [mdWIdx, setMdWIdx] = useState(0);
  const [lgWIdx, setLgWIdx] = useState(0);

  const [minWIdx, setMinWIdx] = useState(0);
  const [maxWIdx, setMaxWIdx] = useState(2);

  const [hIdx, setHIdx] = useState(1);
  const [minHIdx, setMinHIdx] = useState(0);
  const [maxHIdx, setMaxHIdx] = useState(0);

  const boxClass = useMemo(
    () =>
      cn([
        "overflow-auto rounded-lg border border-main-soft bg-main-soft px-3 py-2 text-main font-semibold transition-all",
        widthOptions[wIdx],
        smWidthOptions[smWIdx],
        mdWidthOptions[mdWIdx],
        lgWidthOptions[lgWIdx],
        minWidthOptions[minWIdx],
        maxWidthOptions[maxWIdx],
        heightOptions[hIdx],
        minHeightOptions[minHIdx],
        maxHeightOptions[maxHIdx],
      ]),
    [wIdx, smWIdx, mdWIdx, lgWIdx, minWIdx, maxWIdx, hIdx, minHIdx, maxHIdx]
  );

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">4. Rozmiary: w/h, min/max, sm/md/lg</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Control label="Width" options={widthOptions} value={wIdx} onChange={setWIdx} />
        <Control label="sm width" options={smWidthOptions.map(labelOrNone)} value={smWIdx} onChange={setSmWIdx} />
        <Control label="md width" options={mdWidthOptions.map(labelOrNone)} value={mdWIdx} onChange={setMdWIdx} />
        <Control label="lg width" options={lgWidthOptions.map(labelOrNone)} value={lgWIdx} onChange={setLgWIdx} />
        <Control label="Min width" options={minWidthOptions} value={minWIdx} onChange={setMinWIdx} />
        <Control label="Max width" options={maxWidthOptions} value={maxWIdx} onChange={setMaxWIdx} />
        <Control label="Height" options={heightOptions} value={hIdx} onChange={setHIdx} />
        <Control label="Min height" options={minHeightOptions} value={minHIdx} onChange={setMinHIdx} />
        <Control label="Max height" options={maxHeightOptions} value={maxHIdx} onChange={setMaxHIdx} />
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-4">
        <p className="mb-2 text-sm text-gray-600">Demo box</p>
        <div className={boxClass}>
          Ten element pokazuje jak działają w, h, min-w, max-w, min-h, max-h oraz breakpointy.
          <br />
          Długi tekst do testu przewijania i ograniczeń wysokości.
          Długi tekst do testu przewijania i ograniczeń wysokości.
          Długi tekst do testu przewijania i ograniczeń wysokości.
        </div>
      </div>

      <ClassPreview title="Aktualne klasy rozmiaru" value={boxClass} />
    </section>
  );
}

function labelOrNone(v: string) {
  return v === "" ? "(brak)" : v;
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
      <p className="mb-1 text-xs font-medium text-gray-600">{title}</p>
      <p className="break-words text-xs text-gray-800">{value}</p>
    </div>
  );
}