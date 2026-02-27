"use client";

import { Icon } from "@iconify/react";
import Button from "../components/ui/Button";
import { useMapContext } from "../context/MapContext";

const PlaceDetails = () => {
  const { clickedPlace, setClickedPlace, setLocations, locations } =
    useMapContext();

  if (!clickedPlace) return null;

  const handleAddLocation = () => {
    const newLocation = {
      id: Math.random().toString(36).substr(2, 9),
      lat: clickedPlace.lat,
      lon: clickedPlace.lon,
      name: clickedPlace.name,
    };
    setLocations([...locations, newLocation]);
    setClickedPlace(null);
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-1000 w-full max-w-lg px-4 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Icon icon="openmoji:joystick" className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex">
                    <h5 className=" font-bold text-zinc-800 dark:text-zinc-100 truncate text-xs text-wrap">
                      {clickedPlace.name}
                    </h5>
                  </div>
                  {clickedPlace.address && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {clickedPlace.address}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {clickedPlace.type && (
                      <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-md capitalize">
                        {clickedPlace.type.replace(/_/g, " ")}
                      </span>
                    )}
                    <span className="inline-block text-blue-800 dark:text-blue-200 text-xs rounded-md capitalize">
                      {clickedPlace.lat.toFixed(4)},{" "}
                      {clickedPlace.lon.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  icon="mdi:google"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${clickedPlace.lat},${clickedPlace.lon}`,
                      "_blank",
                    )
                  }
                />
                <Button
                  variant="primary"
                  icon="mdi:plus"
                  className="flex-1 py-3"
                  onClick={handleAddLocation}
                />
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            icon="mdi:close"
            onClick={() => setClickedPlace(null)}
            className="text-zinc-400 -mt-2 -mr-2"
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
