
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ROM_SIZES, RomType } from '@/lib/romUtils';

interface RomSelectorProps {
  value: RomType;
  onChange: (value: RomType) => void;
}

const RomSelector: React.FC<RomSelectorProps> = ({ value, onChange }) => {
  const handleChange = (newValue: string) => {
    onChange(newValue as RomType);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">ROM Type</label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select ROM type" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(ROM_SIZES) as RomType[]).map((type) => (
            <SelectItem key={type} value={type} className="flex justify-between">
              <span>{type}</span>&nbsp;
              <span className="text-muted-foreground text-xs">
                {(ROM_SIZES[type] / 1024).toLocaleString()} KB
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RomSelector;
