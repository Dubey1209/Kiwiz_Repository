import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  className?: string;
}

export function FilterDropdown({
  options,
  selectedFilters,
  onFilterChange,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange([]);
  };

  const isFilterActive = selectedFilters.length > 0;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <Button
        variant={isFilterActive ? "default" : "outline"}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full transition-all duration-300 group"
      >
        <Filter className="w-4 h-4 mr-2" />
        {isFilterActive ? (
          <>
            <span className="mr-2">Filters ({selectedFilters.length})</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="ml-1 p-0.5 rounded-full hover:bg-white/20"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <span>Filters</span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#898AC4] rounded-xl shadow-lg border border-[#A8A9D9] z-50 overflow-hidden animate-in fade-in-20">
          <div className="p-4 border-b border-[#A8A9D9]">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-white">Filter by Category</h3>
              {selectedFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2 text-white hover:bg-white/20"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => toggleFilter(option.id)}
                className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm hover:bg-[#A8A9D9] cursor-pointer transition-colors ${
                  selectedFilters.includes(option.id) ? 'bg-[#A8A9D9]' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className={`capitalize ${selectedFilters.includes(option.id) ? 'text-white font-medium' : 'text-white/90'}`}>
                    {option.name}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${selectedFilters.includes(option.id) ? 'bg-white text-[#898AC4]' : 'bg-white/20 text-white'} hover:bg-white/30`}
                  >
                    {option.count}
                  </Badge>
                </div>
                {selectedFilters.includes(option.id) && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
