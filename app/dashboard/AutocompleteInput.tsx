'use client'
import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css'

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
    <div className={styles.autocomplete} ref={autocompleteRef}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type to search..."
        />
      </div>

      {showOptions && (
        <ul className={styles.options}>
          {filteredOptions.map((option, i) => (
            <li key={i} onClick={() => handleOptionSelect(option)}>
              <span>{option.id}: </span>
              <span>{option.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
