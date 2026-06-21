"use client";

import { useState } from "react";

export default function PositioningSection() {
  const [mode, setMode] = useState<"relative-absolute" | "fixed-demo" | "sticky-demo" | "center-trick">("relative-absolute");
  const [zIdx, setZIdx] = useState(1);
  const [inset, setInset] = useState(false);

  const zOptions = ["z-0", "z-10", "z-20", "z-50"];

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-semibold">9. Pozycjonowanie</h2>

      <div className="flex flex-wrap gap-2">
        {(["relative-absolute", "fixed-demo", "sticky-demo", "center-trick"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === m ? "bg-main text-white border-main" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === "relative-absolute" && (
        <div>
          <p className="mb-2 text-sm text-gray-600">
            Rodzic: <code className="bg-gray-100 px-1 rounded">relative</code> — dziecko: <code className="bg-gray-100 px-1 rounded">absolute top-2 right-2</code>
          </p>
          <div className="relative h-32 rounded-lg border-2 border-main-soft bg-main-soft p-4">
            <span className="text-main font-semibold">Rodzic (relative)</span>
            <div className="absolute top-2 right-2 rounded bg-main px-2 py-1 text-xs font-semibold text-white">
              absolute
            </div>
          </div>
        </div>
      )}

      {mode === "fixed-demo" && (
        <div>
          <p className="mb-2 text-sm text-gray-600">
            <code className="bg-gray-100 px-1 rounded">fixed</code> przykleja do ekranu. Poniższy badge jest fixed — widoczny niezależnie od scrolla.
          </p>
          <div className="fixed bottom-6 right-6 z-50 rounded-full bg-main px-4 py-2 text-sm font-semibold text-white shadow-lg">
            fixed: bottom-6 right-6
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Przewiń stronę — badge pozostaje na miejscu.
          </div>
        </div>
      )}

      {mode === "sticky-demo" && (
        <div>
          <p className="mb-2 text-sm text-gray-600">
            <code className="bg-gray-100 px-1 rounded">sticky top-0</code> — element zostaje w flow, ale przykleja się gdy dotrze do góry ekranu.
          </p>
          <div className="h-40 overflow-y-auto rounded-lg border border-gray-300">
            <div className="sticky top-0 bg-main px-4 py-2 text-sm font-semibold text-white z-10">
              sticky top-0 (przewiń zawartość)
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                Wiersz {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === "center-trick" && (
        <div>
          <p className="mb-2 text-sm text-gray-600">
            Klasyczny trik centrowania: <code className="bg-gray-100 px-1 rounded">left-1/2 -translate-x-1/2</code>
          </p>
          <div className="relative h-24 rounded-lg border border-gray-300 bg-gray-50">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white whitespace-nowrap">
              wycentrowany absolute
            </div>
          </div>
          <div className="grid gap-3 mt-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Z-index</label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                value={zIdx}
                onChange={(e) => setZIdx(Number(e.target.value))}
              >
                {zOptions.map((o, i) => <option key={o} value={i}>{o}</option>)}
              </select>
            </div>
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-1">inset-0 demo</p>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4" checked={inset} onChange={e => setInset(e.target.checked)} />
                włącz inset-0
              </label>
            </div>
          </div>
          <div className="relative mt-3 h-24 rounded-lg border border-gray-300 bg-gray-50">
            <div className={`rounded-lg bg-main/30 border border-main text-main text-xs font-semibold flex items-center justify-center ${inset ? "absolute inset-0" : "absolute top-2 left-2 w-24 h-10"}`}>
              {inset ? "inset-0 (wypełnia rodzica)" : "bez inset-0"}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}