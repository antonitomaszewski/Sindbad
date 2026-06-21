"use client";

import { useMemo, useState } from "react";

function cn(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const textSizeOptions = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-3xl"];
const fontWeightOptions = ["font-medium", "font-semibold", "font-bold", "font-extrabold"];
const trackingOptions = ["tracking-tight", "tracking-normal", "tracking-wide"];
const leadingOptions = ["leading-none", "leading-6", "leading-relaxed"];

const clampOptions = ["line-clamp-none", "line-clamp-2", "line-clamp-3", "line-clamp-4"];
const whiteSpaceOptions = ["whitespace-normal", "whitespace-pre-wrap"];
const breakWordOptions = ["break-normal", "break-words"];
const underlineOffsetOptions = ["underline-offset-0", "underline-offset-2", "underline-offset-4", "underline-offset-8"];

export default function TypographySection() {
  const [sizeIdx, setSizeIdx] = useState(2);
  const [weightIdx, setWeightIdx] = useState(1);
  const [trackingIdx, setTrackingIdx] = useState(1);
  const [leadingIdx, setLeadingIdx] = useState(1);

  const [uppercase, setUppercase] = useState(false);
  const [clampIdx, setClampIdx] = useState(0);
  const [wsIdx, setWsIdx] = useState(0);
  const [breakIdx, setBreakIdx] = useState(1);
  const [underlined, setUnderlined] = useState(true);
  const [offsetIdx, setOffsetIdx] = useState(1);

  const textClass = useMemo(
    () =>
      cn([
        "text-gray-900 transition-all",
        textSizeOptions[sizeIdx],
        fontWeightOptions[weightIdx],
        trackingOptions[trackingIdx],
        leadingOptions[leadingIdx],
        uppercase && "uppercase",
        clampOptions[clampIdx],
        whiteSpaceOptions[wsIdx],
        breakWordOptions[breakIdx],
      ]),
    [sizeIdx, weightIdx, trackingIdx, leadingIdx, uppercase, clampIdx, wsIdx, breakIdx]
  );

  const linkClass = useMemo(
    () =>
      cn([
        "text-main",
        underlined && "underline",
        underlined && underlineOffsetOptions[offsetIdx],
      ]),
    [underlined, offsetIdx]
  );

  const demoText =
    "To jest tekst testowy do eksperymentowania z typografią. SuperDlugieSlowoBezSpacjiKtoreNormalnieRozwalaLayoutJesliNieUzyjeszBreakWords.\nNowa linia do sprawdzenia whitespace-pre-wrap.";

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">5. Czcionki: text, font, tracking, leading i reszta</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Control label="Text size" options={textSizeOptions} value={sizeIdx} onChange={setSizeIdx} />
        <Control label="Weight" options={fontWeightOptions} value={weightIdx} onChange={setWeightIdx} />
        <Control label="Tracking" options={trackingOptions} value={trackingIdx} onChange={setTrackingIdx} />
        <Control label="Leading" options={leadingOptions} value={leadingIdx} onChange={setLeadingIdx} />
        <Control label="Clamp" options={clampOptions} value={clampIdx} onChange={setClampIdx} />
        <Control label="Whitespace" options={whiteSpaceOptions} value={wsIdx} onChange={setWsIdx} />
        <Control label="Break words" options={breakWordOptions} value={breakIdx} onChange={setBreakIdx} />
        <Control label="Underline offset" options={underlineOffsetOptions} value={offsetIdx} onChange={setOffsetIdx} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <Toggle label="uppercase" checked={uppercase} onChange={setUppercase} />
        <Toggle label="underline" checked={underlined} onChange={setUnderlined} />
      </div>

      <div className="rounded-lg border border-gray-300 bg-white p-4 space-y-3">
        <p className={textClass}>{demoText}</p>
        <a href="#" className={linkClass}>
          Link testowy do underline i underline-offset
        </a>
      </div>

      <ClassPreview title="Aktualne klasy tekstu" value={textClass} />
      <ClassPreview title="Aktualne klasy linku" value={linkClass} />
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
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
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