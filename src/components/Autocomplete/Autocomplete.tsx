import React, { useState, useRef, useEffect } from 'react';
import Spinner from '../Spinner/Spinner';
import useOutsideClick from '../../hooks';
import { highlightText } from './Autocomplete.utils';

import './style.css';

export interface AutocompleteProps {
  suggestions: string[];
  onInputChange: (value: string) => void;
  value: string;
  isLoading?: boolean;
  label?: string;
  id?: string;
}

// Note: we could have used <datalist> to keep it as simple as it gets,
// but it is assumed that we'll need it to be fully customizable.
// <datalist> customization is limited so going with fully custom select component
const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  value,
  onInputChange,
  isLoading,
  label,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionListRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const filtered = suggestions.filter(suggestion =>
    suggestion.toLocaleLowerCase().includes(value.toLocaleLowerCase())
  );

  // check if current input matches the only suggestion available
  const isCurrentMatch = filtered.length === 1 ? suggestions[0] === value : false;

  const shouldDropdownOpen = suggestions.length && value.length && !isCurrentMatch;

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions, selectedSuggestionIndex, isFocused]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (suggestions.length && isFocused) {
      switch (event.key) {
        case 'Escape':
          setSelectedSuggestionIndex(-1);
          setDropdownOpen(false);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedSuggestionIndex(prevIndex =>
            prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1
          );
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedSuggestionIndex(prevIndex =>
            prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
          break;
        default:
          break;
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.currentTarget.value;
    setSelectedSuggestionIndex(-1);
    onInputChange(userInput);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onInputChange(suggestion);
    setDropdownOpen(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (shouldDropdownOpen) {
      setDropdownOpen(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    setSelectedSuggestionIndex(-1);
  };

  useOutsideClick(containerRef, () => setDropdownOpen(false));

  useEffect(() => {
    if (shouldDropdownOpen) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  }, [shouldDropdownOpen, value]);

  return (
    <div className='autocomplete' ref={containerRef}>
      <label htmlFor={id}>
        {label} {isLoading && <Spinner />}
      </label>
      <input
        id={id}
        className='input-field'
        type='text'
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder='Type to search...'
        autoComplete='off'
      />
      {!!value && (
        <button tabIndex={1} className='clear-btn' title='Clear' onClick={() => onInputChange('')}>
          x
        </button>
      )}

      {dropdownOpen && (
        <div ref={suggestionListRef} className='suggestion-list fade-in'>
          {filtered.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`suggestion-item ${selectedSuggestionIndex === index ? 'selected' : ''}`}
              onClick={() => handleSuggestionSelect(suggestion)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  handleSuggestionSelect(suggestion);
                }
              }}
            >
              {highlightText(suggestion, value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
