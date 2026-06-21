"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const displayOptions = ["flex", "inline-flex", "block", "inline-block", "grid", "hidden"];
const itemsOptions = ["items-start", "items-center", 'items-baseline', 'items-bottom'];
const justifyOptions = ["justify-center", "justify-between", "justify-end"];
const textAlignOptions = ["text-left", "text-center", "text-right"];
const colSpanOptions = [
  "col-span-1",
  "col-span-2",
  "col-span-3",
  "sm:col-span-2",
  "md:col-span-2",
  "sm:col-span-2 md:col-span-1",
];

export default function TailwindSectionTwo() {
  const [displayIdx, setDisplayIdx] = useState(0);
  const [itemsIdx, setItemsIdx] = useState(0);
  const [justifyIdx, setJustifyIdx] = useState(1);
  const [textAlignIdx, setTextAlignIdx] = useState(0);

  const [isCol, setIsCol] = useState(false);
  const [isWrap, setIsWrap] = useState(false);
  const [firstGrow, setFirstGrow] = useState(false);
  const [secondNoShrink, setSecondNoShrink] = useState(false);

  const [colSpanIdx, setColSpanIdx] = useState(0);
  const currentItemsClass = itemsOptions[itemsIdx];

  const isGrid = displayOptions[displayIdx] === "grid";
  const isFlexLike =
    displayOptions[displayIdx] === "flex" || displayOptions[displayIdx] === "inline-flex";

  const containerClass = useMemo(
    () =>
      cn([
        "min-h-[120px] border border-gray-300 rounded-lg p-3 bg-white transition-all",
        displayOptions[displayIdx],
        isGrid && "grid grid-cols-3 gap-2",
        isFlexLike && "gap-2",
        isFlexLike && isCol && "flex-col",
        isFlexLike && isWrap && "flex-wrap",
        (isFlexLike || isGrid) && itemsOptions[itemsIdx],
        (isFlexLike || isGrid) && justifyOptions[justifyIdx],
        textAlignOptions[textAlignIdx],
      ]),
    [displayIdx, itemsIdx, justifyIdx, textAlignIdx, isGrid, isFlexLike, isCol, isWrap]
  );

  const itemAClass = cn([
    "rounded bg-main-soft border border-main-soft text-main px-3 py-2",
    firstGrow && "flex-1",
    isGrid && colSpanOptions[colSpanIdx],
  ]);

  const itemBClass = cn([
    "rounded bg-gray-100 border border-gray-300 text-gray-800 px-3 py-2",
    secondNoShrink && "shrink-0",
  ]);

  const itemCClass = "rounded bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2";

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">2. Uklad elementow</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Control
          label="Display"
          options={displayOptions}
          value={displayIdx}
          onChange={setDisplayIdx}
        />
        <Control
          label="Items"
          options={itemsOptions}
          value={itemsIdx}
          onChange={setItemsIdx}
        />
        <Control
          label="Justify"
          options={justifyOptions}
          value={justifyIdx}
          onChange={setJustifyIdx}
        />
        <Control
          label="Text align"
          options={textAlignOptions}
          value={textAlignIdx}
          onChange={setTextAlignIdx}
        />
        <Control
          label="Col-span (Item A)"
          options={colSpanOptions}
          value={colSpanIdx}
          onChange={setColSpanIdx}
        />
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Toggle label="flex-col" checked={isCol} onChange={setIsCol} disabled={!isFlexLike} />
        <Toggle label="flex-wrap" checked={isWrap} onChange={setIsWrap} disabled={!isFlexLike} />
        <Toggle label="Item A: flex-1" checked={firstGrow} onChange={setFirstGrow} />
        <Toggle
          label="Item B: shrink-0"
          checked={secondNoShrink}
          onChange={setSecondNoShrink}
        />
      </div>

      <div className={containerClass}>
        <div className={itemAClass}>A</div>
        <div className={itemBClass}>B</div>
        <div className={itemCClass}>C</div>
      </div>

        <div
        className={cn([
        "flex gap-3 min-h-[180px] border border-gray-300 rounded-lg p-4",
        currentItemsClass,
        ])}
        >
        <div className="rounded bg-main-soft border border-main-soft text-main px-4 py-8 font-semibold">
        A
        </div>
        <div className="rounded bg-gray-100 border border-gray-300 text-gray-800 px-4 py-2 font-semibold">
        B
        </div>
        <div className="rounded bg-gray-50 border border-gray-200 text-gray-700 px-4 py-4 font-semibold">
        C
        </div>
        </div>

      <ClassPreview title="Container class" value={containerClass} />
      <ClassPreview title="Item A class" value={itemAClass} />
      <ClassPreview title="Item B class" value={itemBClass} />
      <ClassPreview title="Aktualne klasy" value={currentItemsClass} />
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

function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={cn(["inline-flex items-center gap-2", disabled && "opacity-50"])}>
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
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