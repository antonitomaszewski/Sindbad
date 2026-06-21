"use client";

import { useState } from "react";

export default function StatesSection() {
  const [disabled, setDisabled] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-6">
      <h2 className="text-xl font-semibold">11. Stany: hover, focus, disabled, file</h2>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">hover + focus</p>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md">
            hover:translate + shadow
          </button>
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 hover:border-gray-400">
            hover:bg + border
          </button>
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-main focus:ring-2 focus:ring-main/30 transition-all"
            placeholder="kliknij — focus:border-main focus:ring"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">disabled</p>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4" checked={disabled} onChange={e => setDisabled(e.target.checked)} />
          włącz disabled
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            disabled={disabled}
            className="rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            disabled:opacity-50 cursor-not-allowed
          </button>
          <input
            disabled={disabled}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">file: (stylowanie przycisku input file)</p>
        <label className="block">
          <input
            type="file"
            onChange={e => setFileName(e.target.files?.[0]?.name ?? null)}
            className="w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-main-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-main hover:file:bg-main hover:file:text-white file:transition-colors file:cursor-pointer"
          />
        </label>
        {fileName && <p className="text-sm text-gray-600">Wybrany plik: <span className="font-medium">{fileName}</span></p>}
      </div>
    </section>
  );
}