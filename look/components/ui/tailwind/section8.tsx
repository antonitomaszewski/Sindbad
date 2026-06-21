"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const shadowOptions = ["shadow-none", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl"];
const hoverShadowOptions = ["", "hover:shadow-md", "hover:shadow-lg", "hover:shadow-xl"];
const transitionOptions = ["", "transition-colors", "transition-shadow", "transition-all"];
const durationOptions = ["", "duration-75", "duration-200", "duration-500", "duration-1000"];
const translateOptions = ["", "hover:-translate-y-0.5", "hover:-translate-y-1", "hover:-translate-y-2"];
const opacityOptions = ["opacity-100", "opacity-75", "opacity-50", "opacity-25"];

export default function ShadowsAndTransitionsSection() {
  const [shadowIdx, setShadowIdx] = useState(2);
  const [hoverShadowIdx, setHoverShadowIdx] = useState(2);
  const [transitionIdx, setTransitionIdx] = useState(3);
  const [durationIdx, setDurationIdx] = useState(2);
  const [translateIdx, setTranslateIdx] = useState(2);
  const [opacityIdx, setOpacityIdx] = useState(0);
  const [spin, setSpin] = useState(false);
  const [groupHover, setGroupHover] = useState(false);

  const cardClass = useMemo(
    () =>
      cn([
        "group p-6 rounded-lg border border-gray-200 bg-white cursor-pointer",
        shadowOptions[shadowIdx],
        hoverShadowOptions[hoverShadowIdx],
        transitionOptions[transitionIdx],
        durationOptions[durationIdx],
        translateOptions[translateIdx],
        opacityOptions[opacityIdx],
      ]),
    [shadowIdx, hoverShadowIdx, transitionIdx, durationIdx, translateIdx, opacityIdx]
  );

  const spinClass = cn([
    "w-8 h-8 rounded-full border-4 border-main border-t-transparent",
    spin && "animate-spin",
  ]);

  const groupChildClass = cn([
    "mt-2 text-sm font-medium transition-colors duration-200",
    groupHover ? "text-gray-400 group-hover:text-main" : "text-gray-700",
  ]);

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">8. Cienie i przejścia</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Control label="Shadow" options={shadowOptions} value={shadowIdx} onChange={setShadowIdx} />
        <Control label="Hover shadow" options={hoverShadowOptions.map(l => l || "(brak)")} value={hoverShadowIdx} onChange={setHoverShadowIdx} />
        <Control label="Transition" options={transitionOptions.map(l => l || "(brak)")} value={transitionIdx} onChange={setTransitionIdx} />
        <Control label="Duration" options={durationOptions.map(l => l || "(brak)")} value={durationIdx} onChange={setDurationIdx} />
        <Control label="Hover translate" options={translateOptions.map(l => l || "(brak)")} value={translateIdx} onChange={setTranslateIdx} />
        <Control label="Opacity" options={opacityOptions} value={opacityIdx} onChange={setOpacityIdx} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <Toggle label="animate-spin" checked={spin} onChange={setSpin} />
        <Toggle label="group-hover (najedź na kartę)" checked={groupHover} onChange={setGroupHover} />
      </div>

      <div className={cardClass}>
        <p className="font-semibold text-gray-900">Najedź na mnie</p>
        <p className={groupChildClass}>
          {groupHover ? "Ten tekst zmienia kolor gdy najedziesz na kartę (group-hover)" : "Zwykły tekst"}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className={spinClass} />
          <span className="text-sm text-gray-500">spinner (animate-spin)</span>
        </div>
      </div>

      <ClassPreview title="Aktualne klasy karty" value={cardClass} />
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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" className="h-4 w-4" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="text-sm text-gray-700">{label}</span>
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