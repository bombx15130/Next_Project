'use client'
import React, { useState, useEffect, useRef } from 'react';

export interface SelectItem {
  id: string,
  name: string
}

type AutocompleteProps = {
  options: SelectItem[],
  callback: (item: SelectItem) => void
};

const Autocomplete: React.FC<AutocompleteProps> = ({ options, callback }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<SelectItem[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const filtered = options.filter((option) =>
      option.id.includes(inputValue.toLowerCase()) || option.name.includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowOptions(true);
  };

  const handleOptionSelect = (option: SelectItem) => {
    callback(option)
    setInputValue(option.name);
    setShowOptions(false);
  };

  const handleDocumentClick = (e: MouseEvent) => {
    if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className="relative" ref={autocompleteRef}>
      <div className="flex items-center w-full h-30px bg-white rounded mb-2">
        <input
          className="flex-1 p-0 rounded outline-0 text-xl indent-2"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type to search..."
        />
      </div>

      {showOptions && (
        <ul className="absolute w-4/5 bg-white top-32px max-h-72 overflow-y-auto border border-black border-solid box-border">
          {
            filteredOptions.length === 0 ? (
              <li className="p-5 cursor-pointer">沒有符合的標的</li>
            ) : (
              filteredOptions.map((option, i) => (
                <li key={i} className="p-5 cursor-pointer hover:bg-slate-200" onClick={() => handleOptionSelect(option)}>
                  <span>{option.id}: </span>
                  <span>{option.name}</span>
                </li>
              ))
            )
          }
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
