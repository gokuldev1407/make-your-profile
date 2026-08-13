import React, { useState, useEffect } from 'react';

export const StringArrayInput = ({ 
  value, 
  onChange, 
  separator, 
  placeholder, 
  rows, 
  className 
}: { 
  value: string[]; 
  onChange: (val: string[]) => void; 
  separator: string; 
  placeholder?: string; 
  rows?: number; 
  className?: string;
}) => {
  const [localValue, setLocalValue] = useState(() => value.join(separator === ',' ? ', ' : separator));

  useEffect(() => {
    const currentSanitized = localValue.split(separator).map(s => s.trim()).filter(Boolean).join(separator);
    const propSanitized = value.map(s => s.trim()).filter(Boolean).join(separator);
    if (currentSanitized !== propSanitized) {
      setLocalValue(value.join(separator === ',' ? ', ' : separator));
    }
  }, [value, separator, localValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value.split(separator).map(s => s.trim()).filter(Boolean));
  };

  return (
    <textarea
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      className={className}
    />
  );
};
