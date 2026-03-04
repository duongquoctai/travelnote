"use client";

import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl/maplibre";
import { useMapContext } from "../context/MapContext";

interface MapRoutesProps {
  locations: Array<{ lat: number; lon: number }>;
}

const MapRoutes = ({ locations }: MapRoutesProps) => {
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const { current: map } = useMap();
  const { setDistances } = useMapContext();
  const prevLocationsRef = useRef<string>("");

  useEffect(() => {
    const validLocations = locations.filter(
      (loc) => loc.lat !== 0 && loc.lon !== 0,
    );
    const locationsKey = JSON.stringify(validLocations);

    if (locationsKey === prevLocationsRef.current) return;
    prevLocationsRef.current = locationsKey;

    if (validLocations.length < 2) {
      setRoutePoints((prev) => (prev.length > 0 ? [] : prev));
      setDistances([], 0);
      return;
    }

    const fetchRoute = async () => {
      try {
        const response = await fetch("/api/directions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: validLocations.map((loc) => [loc.lon, loc.lat]),
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch directions");
        const data = await response.json();

        if (data.features && data.features[0]) {
          const points = data.features[0].geometry.coordinates; // [[lon, lat], ...]
          setRoutePoints(points);

          // Extract distances
          const properties = data.features[0].properties;
          const totalDist = properties.summary.distance / 1000; // to km
          const segments = properties.segments || [];
          const segDistances = segments.map(
            (s: { distance: number }) => s.distance / 1000,
          );

          setDistances(segDistances, totalDist);

          if (points.length > 0 && map) {
            const bounds = points.reduce(
              (acc: maplibregl.LngLatBounds, coord: [number, number]) => {
                return acc.extend(coord);
              },
              new maplibregl.LngLatBounds(points[0], points[0]),
            );

            map.fitBounds(bounds, { padding: 50, animate: true });
          }
        }
      } catch (error) {
        console.error("Routing error:", error);
      }
    };

    fetchRoute();
  }, [locations, map, setDistances]);

  if (routePoints.length === 0) return null;

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routePoints,
        },
      },
    ],
  };

  return (
    <Source type="geojson" data={geojson}>
      <Layer
        id="route"
        type="line"
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
        paint={{
          "line-color": "#0018f9",
          "line-width": 5,
          "line-opacity": 1,
          "line-dasharray": [2, 2],
        }}
      />
    </Source>
  );
};

export default MapRoutes;
