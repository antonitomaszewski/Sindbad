// Hook obsługujący Leaflet i klastry pinezek.

import { useEffect, useRef, useState } from 'react';
import type { OfferWithGeo } from '@/look/utils/mapOffers';
import { buildOfferPopupHtml } from '@/look/utils/mapPopup';

const DEFAULT_MAP_CENTER: [number, number] = [52.1, 19.4];
const DEFAULT_MAP_ZOOM = 6;
const MAP_INIT_DELAY_MS = 50;
const MAP_INVALIDATE_DELAY_MS = 100;

type UseLeafletMapProps = {
  offers: OfferWithGeo[];
  hasAnyGeoOffers: boolean;
  loading: boolean;
};

export function useLeafletMap({ offers, hasAnyGeoOffers, loading }: UseLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (loading || !mapContainerRef.current || mapRef.current) return;

      try {
        const L = (await import('leaflet')).default;
        leafletRef.current = L;

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

        if (cancelled || !mapContainerRef.current) return;

        mapRef.current = L.map(mapContainerRef.current, {
          zoomControl: false,
          center: DEFAULT_MAP_CENTER,
          zoom: DEFAULT_MAP_ZOOM,
        });

        L.control.zoom({
          position: 'topright',
          zoomInTitle: 'Przybliż',
          zoomOutTitle: 'Oddal',
        }).addTo(mapRef.current);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mapRef.current);
        setReady(true);

        setTimeout(() => {
          if (mapRef.current && !cancelled) mapRef.current.invalidateSize();
        }, MAP_INVALIDATE_DELAY_MS);
      } catch {
        if (!cancelled) setError('Nie udało się uruchomić mapy. Spróbuj odświeżyć stronę.');
      }
    }

    const timer = setTimeout(initializeMap, MAP_INIT_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      mapRef.current?.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [loading]);

  useEffect(() => {
    if (!ready || !mapRef.current || !leafletRef.current) return;

    const L = leafletRef.current;

    if (markersLayerRef.current) {
      mapRef.current.removeLayer(markersLayerRef.current);
    }

    const markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
    });

    offers.forEach(({ offer, geo }) => {
      L.marker([geo.lat, geo.lon])
        .bindPopup(buildOfferPopupHtml(offer))
        .addTo(markers);
    });

    markersLayerRef.current = markers;
    mapRef.current.addLayer(markers);

    if (offers.length > 0) {
      const bounds = L.latLngBounds(offers.map(({ geo }) => [geo.lat, geo.lon]));
      mapRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 10 });
    } else if (hasAnyGeoOffers) {
      mapRef.current.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
    }

    return () => {
      if (markersLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(markersLayerRef.current);
        markersLayerRef.current = null;
      }
    };
  }, [offers, hasAnyGeoOffers, ready]);

  return { mapContainerRef, error };
}