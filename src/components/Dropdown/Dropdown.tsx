import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./Dropdown.css";

type Option = string;
type OnMultipleChange = (value: Option[]) => void;

interface DropdownProps {
  options: Option[];
  onChange?: OnMultipleChange;
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
}

/**
 * Dropdown Component
 *
 * @param {DropdownProps} props - Props for the Dropdown component.
 * @param {function} props.onChange - Callback function invoked when selection changes.
 * @param {Array} props.options - List of options to display in the dropdown.
 * @param {boolean} props.multiple - Whether multiple options can be selected.
 * @param {boolean} props.searchable - Whether the dropdown supports searching.
 * @param {string} props.placeholder - Placeholder text when no options are selected.
 * @returns {JSX.Element} - The rendered Dropdown component.
 */
function Dropdown({
  onChange,
  options,
  multiple,
  searchable,
  placeholder,
}: DropdownProps): JSX.Element {
  // State for managing the dropdown's behavior
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [availableWidth, setAvailableWidth] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [visibleOptions, setVisibleOptions] = useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const batchSize = 100; // Number of options to load at once

  // LayoutEffect to calculate width pre-render
  useLayoutEffect(() => {
    if (dropdownRef.current) {
      setAvailableWidth(dropdownRef.current.offsetWidth);
    }
  }, []);

  // Client Callback on Selection Change
  useEffect(() => {
    onChange?.(selected);
  }, [onChange, selected]);

  // Event listener to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle checkbox changes
  const handleCheckboxChange = (option: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((item) => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  // Function to toggle the dropdown's open/close state
  const toggleDropdown = () => {
    setIsOpen(!isOpen);

    // If opening the dropdown, load the initial batch of options
    if (!isOpen) {
      loadOptions();
    }
  };

  // Function to load additional options
  const loadOptions = () => {
    const endIndex = Math.min(startIndex + batchSize, options.length);
    const newOptions = options.slice(startIndex, endIndex);
    setVisibleOptions((prevOptions) => [...prevOptions, ...newOptions]);
    setStartIndex(endIndex);
  };

  // Function to render the selected items
  const renderSelectedItems = () => {
    let totalWidth = 0;
    let itemCount = 0;
    const renderedItems: JSX.Element[] = [];

    for (const item of selected) {
      const itemWidth = getItemWidth(item);
      // If adding this item would exceed the available width, stop rendering.
      if (availableWidth !== null && totalWidth + itemWidth > availableWidth) {
        const summaryWidth = getItemWidth(
          `+${selected.length - itemCount} more`
        );

        // Merge case
        if (totalWidth + summaryWidth > availableWidth) {
          renderedItems.pop();
          itemCount -= 1;
        }

        renderedItems.push(
          <div
            key="summary-item"
            className="selected-item"
            onClick={toggleDropdown}
          >
            +{selected.length - itemCount} more
          </div>
        );
        break;
      }

      // Normal case
      totalWidth += itemWidth;
      itemCount += 1;
      renderedItems.push(
        <div key={item} className="selected-item">
          <span>{item}</span>
          <span
            className="remove-item"
            onClick={(e) => handleRemoveSelected(item, e)}
          >
            &times;
          </span>
        </div>
      );
    }

    return renderedItems;
  };

  // Function to clear the selection
  const clearSelection = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    setSelected([]);
  };

  // Function to handle removing a selected item
  const handleRemoveSelected = (
    itemToRemove: string,
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setSelected((prevSelected) =>
      prevSelected.filter((item) => item !== itemToRemove)
    );
  };

  // Function to calculate the width of an item
  const getItemWidth = (item: string) => {
    const fontSize = 14;
    const paddingX = 16;

    // Calculate the approximate width based on text content length
    const textWidth = item.length * (fontSize * 0.6);
    const totalWidth = textWidth + 2 * paddingX;

    return totalWidth;
  };

  // Function to render the "Load More" option for lazy-loading of large input sets
  const renderLoadMoreOption = () => {
    if (startIndex < options.length) {
      return (
        <div className="load-more-option" onClick={loadOptions}>
          See More
        </div>
      );
    }
    return null;
  };

  // Filter options based on search query
  const displayOptions =
    searchQuery.length > 0
      ? options.filter((option) =>
          option.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : visibleOptions;

  // Function to render the visible options
  const renderVisibleOptions = () => {
    const noResultsFound =
      displayOptions.length === 0 && searchQuery.length > 0;

    return (
      <>
        {searchable && (
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              id="search-input"
              name="search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div className="scrollable-options">
          {noResultsFound && (
            <div className="no-results-found">No results found</div>
          )}

          {displayOptions.map((option, index) => {
            const isOptionSelected = selected.includes(option);
            const isOptionDisabled =
              !multiple && !isOptionSelected && selected.length > 0;

            return (
              <label
                className={`dropdown-item custom-checkbox-label ${
                  isOptionDisabled ? "disabled" : ""
                }`}
                key={`option-${index}`}
              >
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  name="search-checkbox"
                  checked={isOptionSelected}
                  onChange={() => handleCheckboxChange(option)}
                  disabled={isOptionDisabled}
                />
                {option}
              </label>
            );
          })}
        </div>

        {searchQuery.length === 0 && renderLoadMoreOption()}
      </>
    );
  };

  // Render the dropdown content
  const dropdownContent = isOpen ? (
    <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
      {renderVisibleOptions()}
    </div>
  ) : null;

  // Render the Dropdown component
  return (
    <div className="dropdown" ref={dropdownRef}>
      <div
        className={`dropdown-area ${isOpen ? "active" : ""}`}
        onClick={toggleDropdown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="selected-items">{renderSelectedItems()}</div>
        {selected.length === 0 ? (
          <div className="placeholder">{placeholder}</div>
        ) : null}
        <div className="dropdown-arrow">
          {isHovered && selected.length > 0 ? (
            <span onClick={clearSelection}>&times;</span>
          ) : (
            <span>&#x2304;</span>
          )}
        </div>
      </div>
      {dropdownContent}
    </div>
  );
}

export default Dropdown;
