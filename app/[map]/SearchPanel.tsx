"use client";

import {
  Location,
  MapTilerFeature,
  MapTilerResponse,
  SearchResult,
} from "@/app/types/map";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import JourneyDrawer from "../components/map/JourneyDrawer";
import Button from "../components/ui/Button";
import { debounce } from "../utils/helper";
import SearchInput from "./SearchInput";

interface SearchPanelProps {
  locations: Location[];
  onUpdateLocations: (locations: Location[]) => void;
}

const SearchPanel = ({ locations, onUpdateLocations }: SearchPanelProps) => {
  const [queries, setQueries] = useState<Record<string, string>>({});
  const [activeResults, setActiveResults] = useState<{
    id: string;
    items: SearchResult[];
  } | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setActiveResults(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Synchronize queries with locations if they change externally
  useEffect(() => {
    const newQueries: Record<string, string> = {};
    locations.forEach((loc) => {
      newQueries[loc.id] = loc.name;
    });
    setQueries(newQueries);
  }, [locations]);

  const performSearch = useCallback(async (id: string, query: string) => {
    if (!query.trim()) {
      setActiveResults(null);
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/search?q=${query}`);
      if (!response.ok) throw new Error("Search failed");
      const data: MapTilerResponse = await response.json();
      const transform = data.features.map((item: MapTilerFeature) => ({
        name: item.text_vi || item.text,
        display_name: item.place_name,
        lat: item.center[1].toString(),
        lon: item.center[0].toString(),
      }));
      setActiveResults({ id, items: transform });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((id: string, val: string) => performSearch(id, val), 1000),
    [performSearch],
  );

  const handleInputChange = (id: string, value: string) => {
    setQueries((prev) => ({ ...prev, [id]: value }));
    debouncedSearch(id, value);
  };

  const selectLocation = (id: string, result: SearchResult) => {
    const newLocations = locations.map((loc) =>
      loc.id === id
        ? {
            ...loc,
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon),
            name: result.name || result.display_name,
          }
        : loc,
    );
    onUpdateLocations(newLocations);
    setActiveResults(null);
    setQueries((prev) => ({
      ...prev,
      [id]: result.name || result.display_name,
    }));
  };

  const addNewLocation = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    onUpdateLocations([...locations, { id: newId, lat: 0, lon: 0, name: "" }]);
  };

  const removeLocation = (id: string) => {
    if (locations.length <= 1) return;
    onUpdateLocations(locations.filter((loc) => loc.id !== id));
  };

  const handleSave = async () => {
    if (locations.length === 0) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/journeys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locations }),
      });

      if (!response.ok) throw new Error("Failed to save journey");

      toast.success("Lưu hành trình thành công!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Đã có lỗi xảy ra khi lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        ref={panelRef}
        className="absolute top-4 right-4 z-10 w-80 md:w-96 flex flex-col gap-3"
      >
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
          <div className="relative flex flex-col gap-6">
            {/* Vertical Dotted Line */}
            {locations.length > 1 && (
              <div className="absolute left-[13px] top-4 bottom-4 w-px border-l-2 border-dotted border-zinc-300 dark:border-zinc-700 z-0" />
            )}

            {locations.map((location) => (
              <SearchInput
                key={location.id}
                id={location.id}
                query={queries[location.id] || ""}
                loading={loadingStates[location.id] || false}
                onQueryChange={handleInputChange}
                onRemove={removeLocation}
                onSelect={selectLocation}
                activeResults={
                  activeResults?.id === location.id ? activeResults.items : null
                }
                isActive={activeResults?.id === location.id}
                isOnlyItem={locations.length <= 1}
              />
            ))}
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              icon="mdi:plus"
              onClick={addNewLocation}
              className="flex-1"
            >
              Thêm địa điểm
            </Button>
            <div className="flex gap-2">
              <Button
                variant="primary"
                icon="mdi:check"
                onClick={handleSave}
                isLoading={isSaving}
                title="Lưu hành trình"
              >
                Lưu
              </Button>
              <Button
                variant="primary"
                icon="mdi:account"
                onClick={() => setIsDrawerOpen(true)}
                title="Hành trình của tôi"
              />
            </div>
          </div>
        </div>
      </div>

      <JourneyDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectJourney={(locs) => onUpdateLocations(locs)}
      />
    </>
  );
};

export default SearchPanel;
