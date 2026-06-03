"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { getOffers } from '../../../logic/lib/offers';
import type { Offer } from '../../../logic/types/offer';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { getCountryName } from '../../../logic/constants/countries';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

type GeoPoint = {
  lat: number;
  lon: number;
};

type OfferWithGeo = {
  offer: Offer;
  geo: GeoPoint;
};

function parseGeo(geoRaw: unknown): GeoPoint | null {
  let geo = geoRaw;

  if (!geo) {
    return null;
  }

  if (typeof geo === 'string') {
    try {
      geo = JSON.parse(geo);
    } catch {
      return null;
    }
  }

  if (typeof geo !== 'object') {
    return null;
  }

  const candidate = geo as { lat?: unknown; lon?: unknown };
  const lat = Number(candidate.lat);
  const lon = Number(candidate.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return null;
  }

  return { lat, lon };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function parsePriceValue(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const normalized = value.replace(',', '.');
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function toDateOnly(value?: string): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getOfferPrice(offer: Offer): number | null {
  if (offer.price_per_person === undefined || offer.price_per_person === null) {
    return null;
  }

  const price = Number(offer.price_per_person);
  return Number.isFinite(price) ? price : null;
}

function getOfferDateRange(offer: Offer): { start: Date | null; end: Date | null } {
  return {
    start: toDateOnly(offer.date_from),
    end: toDateOnly(offer.date_to),
  };
}

function buildOfferPopupHtml(offer: Offer): string {
  const title = escapeHtml(offer.title || 'Rejs');
  const port = escapeHtml(offer.port || 'Port niepodany');
  const country = escapeHtml(offer.country ? getCountryName(offer.country) : 'Kraj niepodany');
  const fromDate = offer.date_from ? new Date(offer.date_from).toLocaleDateString('pl-PL') : '-';
  const toDate = offer.date_to ? new Date(offer.date_to).toLocaleDateString('pl-PL') : '-';

  return `<div style="min-width:220px">
    <strong>${title}</strong><br/>
    <span>${port}, ${country}</span><br/>
    <span>${fromDate} - ${toDate}</span><br/>
    <a href="/oferta/${offer.id}" style="display:inline-block;margin-top:8px;color:#2563eb">Zobacz ofertę</a>
  </div>`;
}

export default function MapaPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const clusterLayerRef = useRef<any>(null);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState<Date | null>(null);
  const [dateToFilter, setDateToFilter] = useState<Date | null>(null);

  const hasActiveFilters = Boolean(
    priceMin.trim() ||
    priceMax.trim() ||
    dateFromFilter ||
    dateToFilter
  );

  function clearFilters() {
    setPriceMin('');
    setPriceMax('');
    setDateFromFilter(null);
    setDateToFilter(null);
  }

  const offersWithGeo = useMemo<OfferWithGeo[]>(() => {
    return offers
      .map((offer) => {
        const geo = parseGeo(offer.geo);
        return geo ? { offer, geo } : null;
      })
      .filter((entry): entry is OfferWithGeo => Boolean(entry));
  }, [offers]);

  const filteredOffersWithGeo = useMemo(() => {
    const minPrice = parsePriceValue(priceMin);
    const normalizedMaxPrice = parsePriceValue(priceMax);

    return offersWithGeo.filter(({ offer }) => {
      const offerPrice = getOfferPrice(offer);
      if ((minPrice !== null || normalizedMaxPrice !== null) && offerPrice === null) {
        return false;
      }

      if (minPrice !== null && offerPrice !== null && offerPrice < minPrice) {
        return false;
      }

      if (normalizedMaxPrice !== null && offerPrice !== null && offerPrice > normalizedMaxPrice) {
        return false;
      }

      const { start: offerStart, end: offerEnd } = getOfferDateRange(offer);

      if (dateFromFilter && (!offerEnd || offerEnd < dateFromFilter)) {
        return false;
      }

      if (dateToFilter && (!offerStart || offerStart > dateToFilter)) {
        return false;
      }

      return true;
    });
  }, [offersWithGeo, priceMin, priceMax, dateFromFilter, dateToFilter]);

  useEffect(() => {
    let cancelled = false;

    async function loadOffers() {
      try {
        setLoading(true);
        setLoadError('');
        const data = await getOffers();

        if (!cancelled) {
          setOffers(data);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError('Nie udało się pobrać ofert do mapy.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let isMapInitialized = false;

    async function initializeMap() {
      if (!mapContainerRef.current || mapRef.current) {
        console.log('EXITING')
        return;
      }

      try {
        console.log('[mapa] importing leaflet');
        const L = (await import('leaflet')).default;
        console.log('[mapa] leaflet loaded', L.version);

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: '/leaflet/marker-icon.png',
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          shadowUrl: '/leaflet/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        (window as any).L = L;
        await import('leaflet.markercluster');
        console.log('[mapa] markercluster loaded');

        if (cancelled || !mapContainerRef.current) {
          console.log('[mapa] cancelled or no container');
          return;
        }

        console.log('[mapa] container height:', mapContainerRef.current.clientHeight);

        mapRef.current = L.map(mapContainerRef.current, {
          zoomControl: false,
          center: [52.1, 19.4],
          zoom: 6,
        });

        L.control.zoom({
          position: 'topright',
          zoomInTitle: 'Przybliż',
          zoomOutTitle: 'Oddal',
        }).addTo(mapRef.current);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Mapa: &copy; OpenStreetMap, autorzy danych',
        }).addTo(mapRef.current);

        isMapInitialized = true;
        setMapReady(true);
        console.log('[mapa] map initialized successfully');

        setTimeout(() => {
          if (mapRef.current && !cancelled) {
            mapRef.current.invalidateSize();
          }
        }, 100);
      } catch (err) {
        console.error('Map initialization error:', err);
        if (!cancelled) {
          setLoadError('Nie udało się uruchomić mapy. Spróbuj odświeżyć stronę.');
        }
      }
    }

    const timer = setTimeout(() => {
      if (!cancelled && !mapRef.current) {
        initializeMap();
      }
    }, 50);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (mapRef.current && isMapInitialized) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
        mapRef.current = null;
        clusterLayerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) {
      return;
    }

    const L = (window as any).L;
    if (!L) {
      return;
    }

    if (clusterLayerRef.current) {
      mapRef.current.removeLayer(clusterLayerRef.current);
    }

    const markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
    });

    filteredOffersWithGeo.forEach(({ offer, geo }) => {
      const marker = L.marker([geo.lat, geo.lon]);
      marker.bindPopup(buildOfferPopupHtml(offer));
      markers.addLayer(marker);
    });

    clusterLayerRef.current = markers;
    mapRef.current.addLayer(markers);

    if (filteredOffersWithGeo.length > 0) {
      const bounds = L.latLngBounds(
        filteredOffersWithGeo.map(({ geo }) => [geo.lat, geo.lon])
      );
      mapRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 10 });
    } else if (offersWithGeo.length > 0) {
      mapRef.current.setView([52.1, 19.4], 6);
    }

    return () => {
      if (clusterLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(clusterLayerRef.current);
        clusterLayerRef.current = null;
      }
    };
  }, [filteredOffersWithGeo, offersWithGeo, mapReady]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        clusterLayerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-main">Mapa rejsów</h1>
        <p className="mt-2 text-gray-600">
          Klastery rozbijają się na mniejsze podczas przybliżania mapy.
        </p>
      </div>

      {loadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {loadError}
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
              <div>
                <label htmlFor="price-min" className="mb-1 block text-xs text-gray-600">
                  Od
                </label>
                <input
                  id="price-min"
                  type="text"
                  inputMode="decimal"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="np. 500"
                />
              </div>
              <div>
                <label htmlFor="price-max" className="mb-1 block text-xs text-gray-600">
                  Do
                </label>
                <input
                  id="price-max"
                  type="text"
                  inputMode="decimal"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="np. 1200"
                />
              </div>
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

      {!loading && (
        <>

          {offersWithGeo.length === 0 && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              Brak ofert z uzupełnioną geolokalizacją. Uzupełnij pola geo, aby pokazać oferty na mapie.
            </div>
          )}

          {offersWithGeo.length > 0 && filteredOffersWithGeo.length === 0 && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              Brak ofert spełniających aktualne filtry.
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        <Link href="/szukaj" className="text-blue-600 hover:underline">
          Przejdź do wyszukiwarki
        </Link>
      </div>
    </div>
  );
}
