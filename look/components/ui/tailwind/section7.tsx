"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const textColorOptions = [
  "text-gray-400", "text-gray-600", "text-gray-900",
  "text-main", "text-red-600", "text-green-700",
];
const bgColorOptions = [
  "bg-white", "bg-gray-50", "bg-gray-100",
  "bg-main-soft", "bg-green-50", "bg-red-50", "bg-yellow-50",
];
const borderColorOptions = [
  "border-gray-200", "border-gray-400",
  "border-main", "border-red-300", "border-green-300",
];

const borderSideOptions = ["border", "border-t", "border-b", "border-l", "border-r", "border-x", "border-y"];
const borderWidthOptions = ["border", "border-2", "border-4"];
const roundedOptions = ["rounded-none", "rounded", "rounded-lg", "rounded-2xl", "rounded-full"];
const roundedSideOptions = ["", "rounded-t-xl", "rounded-b-xl", "rounded-l-xl", "rounded-r-xl"];

export default function ColorsAndBordersSection() {
  const [textIdx, setTextIdx] = useState(1);
  const [bgIdx, setBgIdx] = useState(0);
  const [borderColorIdx, setBorderColorIdx] = useState(0);
  const [borderSideIdx, setBorderSideIdx] = useState(0);
  const [borderWidthIdx, setBorderWidthIdx] = useState(0);
  const [roundedIdx, setRoundedIdx] = useState(2);
  const [roundedSideIdx, setRoundedSideIdx] = useState(0);

  const boxClass = useMemo(
    () =>
      cn([
        "p-6 transition-all font-semibold",
        textColorOptions[textIdx],
        bgColorOptions[bgIdx],
        borderColorOptions[borderColorIdx],
        borderSideOptions[borderSideIdx],
        borderWidthOptions[borderWidthIdx],
        roundedOptions[roundedIdx],
        roundedSideOptions[roundedSideIdx],
      ]),
    [textIdx, bgIdx, borderColorIdx, borderSideIdx, borderWidthIdx, roundedIdx, roundedSideIdx]
  );

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">6+7. Kolory i ramki</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Control label="Text color" options={textColorOptions} value={textIdx} onChange={setTextIdx} />
        <Control label="Background" options={bgColorOptions} value={bgIdx} onChange={setBgIdx} />
        <Control label="Border color" options={borderColorOptions} value={borderColorIdx} onChange={setBorderColorIdx} />
        <Control label="Border side" options={borderSideOptions} value={borderSideIdx} onChange={setBorderSideIdx} />
        <Control label="Border width" options={borderWidthOptions} value={borderWidthIdx} onChange={setBorderWidthIdx} />
        <Control label="Rounded" options={roundedOptions} value={roundedIdx} onChange={setRoundedIdx} />
        <Control label="Rounded side" options={roundedSideOptions.map(l => l || "(brak)")} value={roundedSideIdx} onChange={setRoundedSideIdx} />
      </div>

      <div className={boxClass}>
        Tekst testowy w kontenerze z kolorami i ramkami
      </div>

      <ClassPreview title="Aktualne klasy" value={boxClass} />
    </section>
  );
}

function Control({ label, options, value, onChange }: { label: string; options: string[]; value: number; onChange: (i: number) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" value={value} onChange={e => onChange(Number(e.target.value))}>
        {options.map((o, i) => <option key={o + i} value={i}>{o}</option>)}
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