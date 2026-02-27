"use client";

import { Location } from "@/app/types/map";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import AuthModal from "../components/auth/AuthModal";
import { useMapContext } from "../context/MapContext";
import SearchPanel from "./SearchPanel";

interface MapLoaderProps {
  journeyId?: string;
}

const MapLoader = ({ journeyId }: MapLoaderProps) => {
  const { status } = useSession();
  const {
    locations,
    setLocations,
    setCenter,
    setJourneyName,
    resetMap,
    setClickedPlace,
  } = useMapContext();

  // Sync journey data if ID changes
  useEffect(() => {
    if (!journeyId) {
      resetMap();
      return;
    }

    const fetchJourney = async () => {
      try {
        const response = await fetch(`/api/journeys/${journeyId}`);
        if (!response.ok) throw new Error("Failed to fetch journey");
        const data = await response.json();

        if (data.name) {
          setJourneyName(data.name);
        }

        if (data.locations && data.locations.length > 0) {
          setLocations(data.locations);
          const first = data.locations[0];
          if (first.lat && first.lon) {
            setCenter([first.lat, first.lon]);
          }
        }
        setClickedPlace(null);
      } catch (error) {
        console.error("Error fetching journey:", error);
      }
    };

    fetchJourney();
  }, [
    journeyId,
    setLocations,
    setCenter,
    setJourneyName,
    resetMap,
    setClickedPlace,
  ]);

  const handleUpdateLocations = (newLocations: Location[]) => {
    setLocations(newLocations);
    if (newLocations.length > 0) {
      const lastLocation = newLocations[newLocations.length - 1];
      if (lastLocation.lat !== 0 && lastLocation.lon !== 0) {
        setCenter([lastLocation.lat, lastLocation.lon]);
      }
    }
  };

  const isUnauthenticated = status === "unauthenticated";

  return (
    <div className="relative w-full h-full pointer-events-none">
      {isUnauthenticated && (
        <div className="pointer-events-auto">
          <AuthModal />
        </div>
      )}

      <div
        className={`w-full h-full transition-all duration-500 pointer-events-none ${
          isUnauthenticated ? "select-none blur-[2px] opacity-50" : ""
        }`}
      >
        <SearchPanel
          locations={locations}
          onUpdateLocations={handleUpdateLocations}
          journeyId={journeyId}
        />
      </div>
    </div>
  );
};

export default MapLoader;
