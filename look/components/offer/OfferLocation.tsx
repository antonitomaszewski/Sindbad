"use client";

import { useEffect, useRef } from 'react';
import { COUNTRY_MAP_CENTERS } from '../../../logic/constants/countries';

interface Props {
  country: string;
  port: string;
  geoLat: string;
  geoLon: string;
  countries: { code: string; name: string; namePL: string }[];
  onCountryChange: (value: string) => void;
  onPortChange: (value: string) => void;
  onGeoLatChange: (value: string) => void;
  onGeoLonChange: (value: string) => void;
  errors?: { country?: string; port?: string };
}

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

function ensureStyle(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function ensureScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }

      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    });
    script.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)));
    document.body.appendChild(script);
  });
}

export default function OfferLocation({
  country,
  port,
  geoLat,
  geoLon,
  countries,
  onCountryChange,
  onPortChange,
  onGeoLatChange,
  onGeoLonChange,
  errors,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const previousCountryRef = useRef<string>('');

  useEffect(() => {
    let cancelled = false;

    async function setupMap() {
      if (!mapContainerRef.current) {
        return;
      }

      ensureStyle(LEAFLET_CSS);
      await ensureScript(LEAFLET_JS);

      if (cancelled) {
        return;
      }

      const L = (window as any).L;
      if (!L) {
        return;
      }

      if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([52.1, 19.4], 6);

        L.control.zoom({
          position: 'topright',
          zoomInTitle: 'Przybliż',
          zoomOutTitle: 'Oddal',
        }).addTo(mapRef.current);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Mapa: &copy; OpenStreetMap, autorzy danych',
        }).addTo(mapRef.current);

        mapRef.current.on('click', (event: any) => {
          const lat = Number(event.latlng.lat);
          const lon = Number(event.latlng.lng);

          onGeoLatChange(lat.toFixed(6));
          onGeoLonChange(lon.toFixed(6));
        });
      }
    }

    setupMap().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [onGeoLatChange, onGeoLonChange]);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) {
      return;
    }

    const lat = Number(geoLat);
    const lon = Number(geoLon);
    const hasPoint = Number.isFinite(lat) && Number.isFinite(lon);

    if (!hasPoint) {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      return;
    }

    const latlng = L.latLng(lat, lon);
    if (!markerRef.current) {
      markerRef.current = L.marker(latlng).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng(latlng);
    }

    mapRef.current.setView(latlng, 8);
  }, [geoLat, geoLon]);

  useEffect(() => {
    if (!mapRef.current || !country || previousCountryRef.current === country) {
      return;
    }

    previousCountryRef.current = country;
    const center = COUNTRY_MAP_CENTERS[country];

    if (center) {
      mapRef.current.setView([center.lat, center.lon], 6);
    }
  }, [country]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
          Kraj <span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus-ring-main transition ${
            errors?.country ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Wybierz kraj</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.namePL}
            </option>
          ))}
        </select>
        {errors?.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-2">
          Port <span className="text-red-500">*</span>
        </label>
        <input
          id="port"
          type="text"
          value={port}
          onChange={(e) => onPortChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus-ring-main transition ${
            errors?.port ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="np. Gdańsk, Wilkasy, Split"
        />
        {errors?.port && <p className="mt-1 text-sm text-red-600">{errors.port}</p>}
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">Pozycja na mapie</p>
        <p className="mb-2 text-xs text-gray-500">Kliknij na mapie, aby ustawić punkt wypłynięcia.</p>
        <div ref={mapContainerRef} className="h-72 w-full rounded-lg border border-gray-300" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="geo-lat" className="block text-sm font-medium text-gray-700 mb-2">
            Szerokość geograficzna (lat)
          </label>
          <input
            id="geo-lat"
            type="number"
            step="0.000001"
            value={geoLat}
            onChange={(e) => onGeoLatChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus-ring-main transition"
            placeholder="np. 54.352025"
          />
        </div>

        <div>
          <label htmlFor="geo-lon" className="block text-sm font-medium text-gray-700 mb-2">
            Długość geograficzna (lon)
          </label>
          <input
            id="geo-lon"
            type="number"
            step="0.000001"
            value={geoLon}
            onChange={(e) => onGeoLonChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus-ring-main transition"
            placeholder="np. 18.646639"
          />
        </div>
      </div>
    </div>
  );
}