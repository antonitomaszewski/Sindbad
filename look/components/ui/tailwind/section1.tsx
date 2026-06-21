"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const spacingOptions = ["p-2", "p-4", "p-8"];
const radiusOptions = ["rounded", "rounded-lg", "rounded-2xl"];
const shadowOptions = ["shadow-sm", "shadow-md", "shadow-xl"];
const borderOptions = ["border", "border-2"];
const textSizeOptions = ["text-sm", "text-lg", "text-3xl"];
const leadingOptions = ["leading-none", "leading-6", "leading-relaxed"];

const colorPresetOptions = [
  {
    name: "Neutral",
    box: "bg-white border-gray-300 text-gray-800",
  },
  {
    name: "Main",
    box: "bg-main-soft border-main-soft text-main",
  },
  {
    name: "Status",
    box: "bg-green-50 border-green-200 text-green-800",
  },
];

export default function TailwindSectionOne() {
  const [spacingIdx, setSpacingIdx] = useState(1);
  const [radiusIdx, setRadiusIdx] = useState(1);
  const [shadowIdx, setShadowIdx] = useState(1);
  const [borderIdx, setBorderIdx] = useState(0);
  const [textSizeIdx, setTextSizeIdx] = useState(1);
  const [leadingIdx, setLeadingIdx] = useState(1);
  const [colorIdx, setColorIdx] = useState(0);

  const currentBoxClass = useMemo(
    () =>
      cn([
        "transition-all duration-200",
        spacingOptions[spacingIdx],
        radiusOptions[radiusIdx],
        shadowOptions[shadowIdx],
        borderOptions[borderIdx],
        colorPresetOptions[colorIdx].box,
      ]),
    [spacingIdx, radiusIdx, shadowIdx, borderIdx, colorIdx]
  );

  const currentTextClass = useMemo(
    () =>
      cn([
        "font-semibold tracking-tight",
        textSizeOptions[textSizeIdx],
        leadingOptions[leadingIdx],
      ]),
    [textSizeIdx, leadingIdx]
  );

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">1. Kontener i typografia</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Control label="Spacing" options={spacingOptions} value={spacingIdx} onChange={setSpacingIdx} />
        <Control label="Radius" options={radiusOptions} value={radiusIdx} onChange={setRadiusIdx} />
        <Control label="Shadow" options={shadowOptions} value={shadowIdx} onChange={setShadowIdx} />
        <Control label="Border" options={borderOptions} value={borderIdx} onChange={setBorderIdx} />
        <Control label="Text size" options={textSizeOptions} value={textSizeIdx} onChange={setTextSizeIdx} />
        <Control label="Leading" options={leadingOptions} value={leadingIdx} onChange={setLeadingIdx} />
        <Control
          label="Kolor preset"
          options={colorPresetOptions.map((x) => x.name)}
          value={colorIdx}
          onChange={setColorIdx}
        />
      </div>

      <div className={currentBoxClass}>
        <p className={currentTextClass}>
          Ten blok służy do porównywania spacing, radius, shadow, border, text i leading.
        </p>
      </div>

      <ClassPreview title="Aktualne klasy kontenera" value={currentBoxClass} />
      <ClassPreview title="Aktualne klasy tekstu" value={currentTextClass} />
    </section>
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