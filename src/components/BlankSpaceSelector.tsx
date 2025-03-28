
import React from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BLANK_SPACE_SIZES, BlankSpaceSize, FillType } from '@/lib/romUtils';
import { PlusCircle } from 'lucide-react';

interface BlankSpaceSelectorProps {
  onAddBlankSpace: (size: number, fillType: FillType) => void;
}

const BlankSpaceSelector: React.FC<BlankSpaceSelectorProps> = ({ onAddBlankSpace }) => {
	const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = React.useState<BlankSpaceSize>('4KB');
  const [fillType, setFillType] = React.useState<FillType>(0x00);

  const handleAddBlankSpace = () => {
    const sizeInBytes = BLANK_SPACE_SIZES[selectedSize];
    onAddBlankSpace(sizeInBytes, fillType);
  };

  return (
  
    <div className="space-y-4 p-4 border rounded-md bg-card">
      <h3 className="font-medium">{t('add.blank.space')}</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">{t('size')}</label>
        <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as BlankSpaceSize)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('select.size')} />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(BLANK_SPACE_SIZES) as BlankSpaceSize[]).map((size) => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">{t('fill.pattern')}</label>
        <Select value={String(fillType)} onValueChange={(value) => setFillType(Number(value) as FillType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('fill.pattern')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0x00 ({t('zeros')})</SelectItem>
            <SelectItem value="255">0xFF ({t('ones')})</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleAddBlankSpace}
      >
        <PlusCircle size={16} className="mr-2" />
        {t('add.blank.space')}
      </Button>
    </div>
  );
};

export default BlankSpaceSelector;
