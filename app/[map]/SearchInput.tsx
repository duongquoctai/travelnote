import { SearchResult } from "@/app/types/map";
import { Icon } from "@iconify/react";

interface SearchInputProps {
  id: string;
  query: string;
  loading: boolean;
  onQueryChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string, result: SearchResult) => void;
  activeResults: SearchResult[] | null;
  isActive: boolean;
  isOnlyItem: boolean;
}

const SearchInput = ({
  id,
  query,
  loading,
  onQueryChange,
  onRemove,
  onSelect,
  activeResults,
  isActive,
  isOnlyItem,
}: SearchInputProps) => {
  return (
    <div className="relative" style={{ zIndex: isActive ? 50 : 10 }}>
      <div className="flex items-center gap-3">
        {/* Location Dot */}
        <div className="shrink-0 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>

        {/* Search Input Container */}
        <div className="relative flex-1 group">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(id, e.target.value)}
            placeholder="Tìm kiếm địa điểm..."
            className="w-full pl-3 pr-20 py-2.5 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />

          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            {loading && (
              <div className="p-1.5">
                <Icon
                  icon="mdi:loading"
                  className="animate-spin h-4 w-4 text-blue-500"
                />
              </div>
            )}
            {!isOnlyItem && (
              <button
                onClick={() => onRemove(id)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
                title="Xóa điểm này"
              >
                <Icon icon="mdi:delete" className="w-4 h-4" />
              </button>
            )}
            <div className="p-1.5 text-zinc-400">
              <Icon icon="mdi:magnify" className="w-4 h-4" />
            </div>
          </div>

          {/* Dropdown Results */}
          {isActive && activeResults && activeResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-9999 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="max-h-60 overflow-y-auto custom-scrollbar text-left flex flex-col">
                {activeResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelect(id, result)}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group border-b border-zinc-100 dark:border-zinc-800 last:border-none"
                  >
                    <div className="flex flex-col gap-0.5 pointer-events-none">
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 line-clamp-1">
                        {result.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {result.display_name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
