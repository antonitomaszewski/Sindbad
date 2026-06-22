// Strona mapy rejsów.
// Pokazuje filtry i kontener mapy.
"use client";

import { useMemo, useState } from 'react';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { useLeafletMap } from '../../hooks/useLeafletMap';
import { useMapOffers } from '../../hooks/useMapOffers';
import { dateToString } from '../../utils/dateFormatter';
import { filterMapOffers, getOffersWithGeo } from '../../utils/mapOffers';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

type PriceFilterKey = 'priceMin' | 'priceMax';

const PRICE_INPUTS: { key: PriceFilterKey; label: string; placeholder: string }[] = [
  { key: 'priceMin', label: 'Od', placeholder: 'np. 500' },
  { key: 'priceMax', label: 'Do', placeholder: 'np. 1200' },
];

export default function MapaPage() {
  const { offers, loading, error: offersError } = useMapOffers();
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');
  const [dateFromFilter, setDateFromFilter] = useState<Date | null>(null);
  const [dateToFilter, setDateToFilter] = useState<Date | null>(null);

  const priceValues = { priceMin, priceMax };
  const priceSetters = { priceMin: setPriceMin, priceMax: setPriceMax };

  const offersWithGeo = useMemo(() => getOffersWithGeo(offers), [offers]);
  const visibleOffers = useMemo(() => filterMapOffers({
    offers: offersWithGeo,
    priceMin,
    priceMax,
    dateFrom: dateToString(dateFromFilter),
    dateTo: dateToString(dateToFilter),
  }), [offersWithGeo, priceMin, priceMax, dateFromFilter, dateToFilter]);

  const { mapContainerRef, error: mapError } = useLeafletMap({
    offers: visibleOffers,
    hasAnyGeoOffers: offersWithGeo.length > 0,
    loading,
  });

  const error = offersError || mapError;
  const hasActiveFilters = Boolean(priceMin || priceMax || dateFromFilter || dateToFilter);

  function clearFilters() {
    setPriceMin('');
    setPriceMax('');
    setDateFromFilter(null);
    setDateToFilter(null);
  }

  function updatePriceFilter(key: PriceFilterKey, value: string, numberValue: number) {
    priceSetters[key](value === '' ? '' : numberValue);
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-6 text-3xl font-bold text-main">Mapa rejsów</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-800">Filtry mapy</p>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Wyczyść filtry
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="mb-3 flex h-6 items-start text-xs font-medium uppercase tracking-wide text-gray-500 leading-none">
              Cena za osobę
            </p>
            <div className="space-y-3">
              {PRICE_INPUTS.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label htmlFor={key} className="mb-1 block text-xs text-gray-600">
                    {label}
                  </label>
                  <input
                    id={key}
                    type="number"
                    min="0"
                    value={priceValues[key]}
                    onChange={(event) => updatePriceFilter(key, event.target.value, event.target.valueAsNumber)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-3">
            <p className="mb-3 flex h-6 items-start text-xs font-medium uppercase tracking-wide text-gray-500 leading-none">
              Termin rejsu
            </p>
            <DateRangePicker
              startDate={dateFromFilter}
              endDate={dateToFilter}
              onStartDateChange={setDateFromFilter}
              onEndDateChange={setDateToFilter}
              startLabel="Termin od"
              endLabel="Termin do"
              fieldClassName="max-w-[240px]"
              popperClassName="map-datepicker-popper"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          Ładowanie mapy...
        </div>
      )}

      <div
        ref={mapContainerRef}
        className={`h-[65vh] min-h-[420px] w-full rounded-xl border border-gray-200 ${loading ? 'hidden' : ''}`}
      />

      {!loading && offersWithGeo.length === 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
          Brak ofert z uzupełnioną geolokalizacją. Uzupełnij pola geo, aby pokazać oferty na mapie.
        </div>
      )}

      {!loading && offersWithGeo.length > 0 && visibleOffers.length === 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
          Brak ofert spełniających aktualne filtry.
        </div>
      )}
    </div>
  );
}