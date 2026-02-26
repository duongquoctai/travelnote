"use client";

import { LocationProperties } from "@/app/types/map";
import { Icon } from "@iconify/react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import MapLibre, {
  MapRef,
  Marker,
  MarkerEvent,
  Popup,
  StyleSpecification,
} from "react-map-gl/maplibre";
import LocationPopup from "./LocationPopup";
import MapRoutes from "./MapRoutes";

interface MarkerData {
  id: string;
  position: [number, number];
  label?: string;
  properties?: LocationProperties;
}

interface MapProps {
  center: [number, number];
  markers: MarkerData[];
  onUpdateProperties: (id: string, properties: LocationProperties) => void;
}

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

function Map({ center, markers, onUpdateProperties }: MapProps) {
  const mapRef = useRef<MapRef>(null);
  const [activePopupIds, setActivePopupIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [center[1], center[0]],
        zoom: 15,
        duration: 1500,
      });
    }
  }, [center]);

  const routeLocations = useMemo(
    () =>
      markers.map((m) => ({
        lat: m.position[0],
        lon: m.position[1],
      })),
    [markers],
  );

  const handleMarkerClick = (e: MarkerEvent<MouseEvent>, id: string) => {
    e.originalEvent.stopPropagation();
    setActivePopupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapLibre
        ref={mapRef}
        initialViewState={{
          longitude: center[1],
          latitude: center[0],
          zoom: 13,
        }}
        mapStyle={MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
        onClick={() => setActivePopupIds(new Set())}
      >
        <MapRoutes locations={routeLocations} />

        {markers.map((marker) => (
          <div key={marker.id}>
            <Marker
              longitude={marker.position[1]}
              latitude={marker.position[0]}
              anchor="bottom"
              onClick={(e) => handleMarkerClick(e, marker.id)}
            >
              <div className="text-red-500 cursor-pointer hover:scale-110 transition-transform drop-shadow-lg">
                <Icon icon="mdi:map-marker" className="w-10 h-10" />
              </div>
            </Marker>
            {activePopupIds.has(marker.id) && (
              <Popup
                longitude={marker.position[1]}
                latitude={marker.position[0]}
                anchor="top"
                closeButton={false}
                closeOnClick={false}
                offset={10}
                maxWidth="300px"
                onClose={() => {
                  setActivePopupIds((prev) => {
                    const next = new Set(prev);
                    next.delete(marker.id);
                    return next;
                  });
                }}
              >
                <LocationPopup
                  id={marker.id}
                  name={marker.label || "Vị trí"}
                  properties={marker.properties}
                  onUpdate={onUpdateProperties}
                />
              </Popup>
            )}
          </div>
        ))}
      </MapLibre>
    </div>
  );
}

export default Map;
