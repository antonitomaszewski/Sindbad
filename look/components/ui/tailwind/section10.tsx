"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const overflowOptions = ["overflow-visible", "overflow-hidden", "overflow-auto", "overflow-y-auto"];
const aspectOptions = ["aspect-[1/1]", "aspect-video", "aspect-[4/3]", "aspect-[3/4]"];
const objectOptions = ["object-cover", "object-contain", "object-fill"];

export default function OverflowAndMediaSection() {
  const [overflowIdx, setOverflowIdx] = useState(0);
  const [aspectIdx, setAspectIdx] = useState(0);
  const [objectIdx, setObjectIdx] = useState(0);
  const [selectNone, setSelectNone] = useState(false);

  const containerClass = useMemo(
    () => cn(["w-48 rounded-lg border border-gray-300 bg-gray-50 p-2", overflowOptions[overflowIdx]]),
    [overflowIdx]
  );

  const imageClass = useMemo(
    () => cn(["w-full rounded-lg bg-gray-200", aspectOptions[aspectIdx], objectOptions[objectIdx]]),
    [aspectIdx, objectIdx]
  );

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">10. Overflow i media</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Control label="Overflow" options={overflowOptions} value={overflowIdx} onChange={setOverflowIdx} />
        <Control label="Aspect ratio" options={aspectOptions} value={aspectIdx} onChange={setAspectIdx} />
        <Control label="Object fit" options={objectOptions} value={objectIdx} onChange={setObjectIdx} />
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4" checked={selectNone} onChange={e => setSelectNone(e.target.checked)} />
        <span>select-none (zablokuj zaznaczanie)</span>
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm text-gray-600">Demo overflow</p>
          <div className={containerClass} style={{ maxHeight: "80px" }}>
            <p className={selectNone ? "select-none text-sm" : "text-sm"}>
              Dużo tekstu który nie mieści się w kontenerze. Dużo tekstu który nie mieści się w kontenerze. Dużo tekstu który nie mieści się w kontenerze.
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-gray-600">Demo aspect + object-fit</p>
          <div className="w-48">
            <img
              src="https://picsum.photos/400/300"
              alt="demo"
              className={imageClass}
            />
          </div>
        </div>
      </div>

      <ClassPreview title="Klasy kontenera" value={containerClass} />
      <ClassPreview title="Klasy obrazka" value={imageClass} />
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