// src/components/Filters.jsx
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

// --- Sorting options shown in the dropdown menu ---
const SORT_OPTIONS = [
  { label: "Most Popular", value: "popularityDesc" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Price: High to Low", value: "priceDesc" },
];

export default function Filters({ sort, setSort, range, setRange, useRange, setUseRange }) {
  // Determine which label to display on the button
  const activeLabel = useRange
    ? `Price Range • $${range[0]}–$${range[1]}`
    : SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Filters";

  // --- Inner component for the price range slider ---
  const PriceRangeMenu = () => {
    const [localRange, setLocalRange] = useState(range);
    // Keep local slider state in sync with global range
    useEffect(() => setLocalRange(range), [range]);
    return (
      <div className="border-t p-3" onMouseDown={(e) => e.stopPropagation()}>
        <div className="text-xs text-gray-500 mb-2">Price Range</div>
        <Slider
          range
          min={0}
          max={2000}
          step={10}
          value={localRange}
          onChange={setLocalRange}
          onAfterChange={(vals) => {
            setRange(vals);
            setUseRange(true); 
            setSort("");       
          }}
          trackStyle={[{ height: 6 }]}
          railStyle={{ height: 6 }}
          handleStyle={[
            { height: 16, width: 16, marginTop: -6 },
            { height: 16, width: 16, marginTop: -6 },
          ]}
        />
        <div className="flex justify-between mt-2 text-xs text-gray-600 font-['Avenir'] font-normal">
          <span>${localRange[0]}</span>
          <span>${localRange[1]}</span>
        </div>
      </div>
    );
  };

  return (
    // --- Sort & Filter dropdown menu ---
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="group inline-flex items-center border rounded-xl px-3 py-2 text-sm hover:bg-gray-50 font-['Avenir'] font-normal">
        {activeLabel}
        <ChevronDownIcon className="ml-1 size-5 text-gray-400" />
      </MenuButton>

      {/* Dropdown content */}
      <MenuItems className="absolute right-0 z-10 mt-2 w-64 bg-white rounded-md shadow-2xl ring-1 ring-black/5">
        <div className="py-1">
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value}>
              {({ active }) => (
                <button
                  onClick={() => {
                    setSort(opt.value);
                    setUseRange(false); 
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm font-['Avenir'] font-normal ${
                    active ? "bg-gray-100" : ""
                  } ${sort === opt.value ? "font-medium text-gray-900" : "text-gray-600"}`}
                >
                  {opt.label}
                </button>
              )}
            </MenuItem>
          ))}
        </div>

        <PriceRangeMenu />
      </MenuItems>
    </Menu>
  );
}
