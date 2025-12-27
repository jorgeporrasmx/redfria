"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Carrier } from "@/lib/models";
import { AvailabilityBadge } from "./ui/badge";
import { Button } from "./ui/button";
import { RatingDisplay } from "./ui/rating";
import { MapPin, Thermometer, Package, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon based on availability
function createMarkerIcon(status: Carrier["availabilityStatus"]) {
  const colors = {
    GREEN: "#22c55e",
    YELLOW: "#eab308",
    RED: "#ef4444",
  };

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${colors[status]};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// Component to fit bounds when carriers change
function FitBounds({ carriers }: { carriers: Carrier[] }) {
  const map = useMap();

  useEffect(() => {
    if (carriers.length > 0) {
      const bounds = L.latLngBounds(carriers.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [carriers, map]);

  return null;
}

interface MapComponentProps {
  carriers: Carrier[];
  selectedCarrierId?: string;
  onSelectCarrier?: (carrier: Carrier) => void;
}

export function MapComponent({
  carriers,
  selectedCarrierId,
  onSelectCarrier,
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    );
  }

  // Default center (Mexico - Bajío region)
  const defaultCenter: [number, number] = [22.5, -102.0];
  const defaultZoom = 6;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {carriers.length > 0 && <FitBounds carriers={carriers} />}

      {carriers.map((carrier) => (
        <Marker
          key={carrier.id}
          position={[carrier.lat, carrier.lng]}
          icon={createMarkerIcon(carrier.availabilityStatus)}
          eventHandlers={{
            click: () => onSelectCarrier?.(carrier),
          }}
        >
          <Popup>
            <div className="min-w-[200px] p-2">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  {carrier.companyName}
                </h3>
              </div>
              <AvailabilityBadge status={carrier.availabilityStatus} />

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {carrier.city}, {carrier.state}
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  {carrier.tempRangeMin}°C a {carrier.tempRangeMax}°C
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {carrier.capacityPallets} pallets
                </div>
              </div>

              {carrier.ratingAvg > 0 && (
                <div className="mt-2">
                  <RatingDisplay
                    rating={carrier.ratingAvg}
                    count={carrier.ratingCount}
                    size="sm"
                  />
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <Button
                  asChild
                  variant="whatsapp"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  <a
                    href={`https://wa.me/${carrier.phone.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  <Link href={`/app/perfil/carrier/${carrier.id}`}>
                    <User className="h-3 w-3 mr-1" />
                    Perfil
                  </Link>
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
