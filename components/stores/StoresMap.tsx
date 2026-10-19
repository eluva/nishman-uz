'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { siteConfig } from '@/site.config';

export interface MapStore {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

interface Props {
  stores: MapStore[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Включено ли управление (на телефоне — после нажатия, чтобы карта не перехватывала скролл) */
  interactive: boolean;
}

function Controller({ stores, activeId, interactive }: Pick<Props, 'stores' | 'activeId' | 'interactive'>) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    const s = stores.find((x) => x.id === activeId);
    if (!s) return;
    if (first.current) {
      first.current = false;
      map.fitBounds(L.latLngBounds(stores.map((x) => [x.lat, x.lng])), { padding: [48, 48], maxZoom: 13 });
      return;
    }
    map.flyTo([s.lat, s.lng], 14, { duration: 1.1 });
  }, [activeId, map, stores]);
  useEffect(() => {
    const handlers = [map.dragging, map.touchZoom, map.doubleClickZoom, map.boxZoom, map.keyboard];
    handlers.forEach((h) => (interactive ? h.enable() : h.disable()));
    map.scrollWheelZoom.disable(); // колесо мыши всегда прокручивает страницу
  }, [interactive, map]);
  return null;
}

/** Карта: тёмные тайлы (CARTO Dark Matter по ключу или затемнённый OSM) и золотые маркеры */
export default function StoresMap({ stores, activeId, onSelect, interactive }: Props) {
  const icons = useMemo(
    () => ({
      base: L.divIcon({ className: 'nm-hit', html: '<span class="nm-marker"></span>', iconSize: [44, 44], iconAnchor: [22, 22] }),
      active: L.divIcon({ className: 'nm-hit', html: '<span class="nm-marker is-active"></span>', iconSize: [44, 44], iconAnchor: [22, 22] }),
    }),
    [],
  );
  return (
    <MapContainer
      center={[stores[0].lat, stores[0].lng]}
      zoom={12}
      zoomControl
      scrollWheelZoom={false}
      attributionControl
      className={`h-full w-full ${siteConfig.map.darkFilter ? 'nm-dark-tiles' : ''}`}
    >
      <TileLayer url={siteConfig.map.tileUrl} attribution={siteConfig.map.attribution} maxZoom={19} />
      {stores.map((s) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={s.id === activeId ? icons.active : icons.base}
          title={s.name}
          alt={s.name}
          eventHandlers={{ click: () => onSelect(s.id) }}
        />
      ))}
      <Controller stores={stores} activeId={activeId} interactive={interactive} />
    </MapContainer>
  );
}
