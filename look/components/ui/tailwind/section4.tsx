"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const paddingOptions = [
  "p-2",
  "p-4",
  "p-8",
  "px-6 py-2",
  "px-2 py-6",
  "pt-6 pr-2 pb-2 pl-2",
];

const mtOptions = ["mt-0", "mt-2", "mt-4", "mt-8"];
const mbOptions = ["mb-0", "mb-2", "mb-4", "mb-8"];
const gapOptions = ["gap-0", "gap-2", "gap-4", "gap-8"];
const spaceYOptions = ["space-y-0", "space-y-2", "space-y-4", "space-y-8"];
const spaceXOptions = ["space-x-0", "space-x-2", "space-x-4", "space-x-8"];

export default function SpacingSection() {
  const [paddingIdx, setPaddingIdx] = useState(1);
  const [mtIdx, setMtIdx] = useState(1);
  const [mbIdx, setMbIdx] = useState(1);
  const [gapIdx, setGapIdx] = useState(2);
  const [spaceYIdx, setSpaceYIdx] = useState(2);
  const [spaceXIdx, setSpaceXIdx] = useState(2);

  const boxClass = useMemo(
    () =>
      cn([
        "inline-block rounded-lg border border-main-soft bg-main-soft text-main font-semibold",
        paddingOptions[paddingIdx],
        mtOptions[mtIdx],
        mbOptions[mbIdx],
      ]),
    [paddingIdx, mtIdx, mbIdx]
  );

  const gapClass = useMemo(
    () => cn(["grid grid-cols-3 rounded-lg border border-gray-300 bg-white p-4", gapOptions[gapIdx]]),
    [gapIdx]
  );

  const spaceYClass = useMemo(
    () => cn(["rounded-lg border border-gray-300 bg-white p-4", spaceYOptions[spaceYIdx]]),
    [spaceYIdx]
  );

  const spaceXClass = useMemo(
    () => cn(["flex rounded-lg border border-gray-300 bg-white p-4", spaceXOptions[spaceXIdx]]),
    [spaceXIdx]
  );

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">3. Spacing: p/m, gap, space-x, space-y</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Control label="Padding" options={paddingOptions} value={paddingIdx} onChange={setPaddingIdx} />
        <Control label="Margin top" options={mtOptions} value={mtIdx} onChange={setMtIdx} />
        <Control label="Margin bottom" options={mbOptions} value={mbIdx} onChange={setMbIdx} />
        <Control label="Gap" options={gapOptions} value={gapIdx} onChange={setGapIdx} />
        <Control label="Space Y" options={spaceYOptions} value={spaceYIdx} onChange={setSpaceYIdx} />
        <Control label="Space X" options={spaceXOptions} value={spaceXIdx} onChange={setSpaceXIdx} />
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-4">
        <p className="text-sm text-gray-600 mb-2">Demo p/m (jeden element)</p>
        <div className={boxClass}>BOX</div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Demo gap (odstęp w grid/flex)</p>
        <div className={gapClass}>
          <Cell>A</Cell>
          <Cell>B</Cell>
          <Cell>C</Cell>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-gray-600 mb-2">Demo space-y (lista pionowa)</p>
          <div className={spaceYClass}>
            <Cell>1</Cell>
            <Cell>2</Cell>
            <Cell>3</Cell>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Demo space-x (lista pozioma)</p>
          <div className={spaceXClass}>
            <Cell>1</Cell>
            <Cell>2</Cell>
            <Cell>3</Cell>
          </div>
        </div>
      </div>

      <ClassPreview title="Klasy p/m" value={boxClass} />
      <ClassPreview title="Klasy gap" value={gapClass} />
      <ClassPreview title="Klasy space-y" value={spaceYClass} />
      <ClassPreview title="Klasy space-x" value={spaceXClass} />
    </section>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded border border-gray-300 bg-gray-50 px-3 py-2 text-center text-sm font-medium text-gray-700">
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