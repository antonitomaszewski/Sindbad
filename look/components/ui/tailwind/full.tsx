"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const spacingOptions = ["p-2", "p-4", "p-8"];
const radiusOptions = ["rounded", "rounded-lg", "rounded-2xl"];
const shadowOptions = ["shadow-sm", "shadow-md", "shadow-xl"];
const textSizeOptions = ["text-sm", "text-lg", "text-3xl"];
const leadingOptions = ["leading-none", "leading-6", "leading-relaxed"];
const borderOptions = ["border", "border-2"];
const colorPresetOptions = [
  {
    name: "Neutral",
    box: "bg-white border-gray-300 text-gray-800",
    button: "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50",
  },
  {
    name: "Main",
    box: "bg-main-soft border-main-soft text-main",
    button: "bg-main text-white hover-bg-main",
  },
  {
    name: "Status",
    box: "bg-green-50 border-green-200 text-green-800",
    button: "bg-error text-white hover-bg-error",
  },
];

const layoutOptions = ["flex", "grid"];
const alignOptions = ["items-start", "items-center"];
const justifyOptions = ["justify-start", "justify-between", "justify-center"];
const gapOptions = ["gap-2", "gap-4", "gap-8"];

export default function TailwindPlayground() {
  const [spacingIdx, setSpacingIdx] = useState(1);
  const [radiusIdx, setRadiusIdx] = useState(1);
  const [shadowIdx, setShadowIdx] = useState(1);
  const [textSizeIdx, setTextSizeIdx] = useState(1);
  const [leadingIdx, setLeadingIdx] = useState(1);
  const [borderIdx, setBorderIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);

  const [layoutIdx, setLayoutIdx] = useState(0);
  const [alignIdx, setAlignIdx] = useState(1);
  const [justifyIdx, setJustifyIdx] = useState(1);
  const [gapIdx, setGapIdx] = useState(1);

  const [isDisabled, setIsDisabled] = useState(false);

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

  const currentLayoutClass = useMemo(
    () =>
      cn([
        layoutOptions[layoutIdx],
        alignOptions[alignIdx],
        justifyOptions[justifyIdx],
        gapOptions[gapIdx],
        layoutOptions[layoutIdx] === "grid" && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
      ]),
    [layoutIdx, alignIdx, justifyIdx, gapIdx]
  );

  const currentButtonClass = useMemo(
    () =>
      cn([
        "px-4 py-2 rounded-lg font-medium transition-colors",
        colorPresetOptions[colorIdx].button,
        isDisabled && "opacity-50 cursor-not-allowed",
      ]),
    [colorIdx, isDisabled]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-main">Tailwind Playground</h1>
        <p className="text-sm text-gray-600">
          Zmieniaj klastry i obserwuj różnice wizualne w czasie rzeczywistym.
        </p>
      </header>

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

      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-xl font-semibold">2. Układ: flex vs grid</h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Control label="Layout" options={layoutOptions} value={layoutIdx} onChange={setLayoutIdx} />
          <Control label="Align" options={alignOptions} value={alignIdx} onChange={setAlignIdx} />
          <Control label="Justify" options={justifyOptions} value={justifyIdx} onChange={setJustifyIdx} />
          <Control label="Gap" options={gapOptions} value={gapIdx} onChange={setGapIdx} />
        </div>

        <div className={cn(["border border-gray-200 rounded-lg p-4", currentLayoutClass])}>
          <DemoCard text="A" />
          <DemoCard text="B" />
          <DemoCard text="C" />
        </div>

        <ClassPreview title="Aktualne klasy układu" value={currentLayoutClass} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-xl font-semibold">3. Stany: hover, focus, disabled</h2>

        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isDisabled}
            onChange={(e) => setIsDisabled(e.target.checked)}
            className="h-4 w-4"
          />
          Disabled
        </label>

        <div>
          <button className={currentButtonClass} disabled={isDisabled}>
            Testowy przycisk
          </button>
        </div>

        <ClassPreview title="Aktualne klasy przycisku" value={currentButtonClass} />
      </section>
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

function DemoCard({ text }: { text: string }) {
  return (
    <div className="rounded-lg bg-main-soft border border-main-soft p-4 text-main font-semibold text-center">
      {text}
    </div>
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