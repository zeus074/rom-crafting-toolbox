
import React from 'react';
import { RomType, ROM_SIZES, RomSegment, getTotalSize, formatBytes } from '@/lib/romUtils';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/lib/languageContext';

interface RomUsageStatsProps {
  romType: RomType;
  segments: RomSegment[];
}

const RomUsageStats: React.FC<RomUsageStatsProps> = ({ romType, segments }) => {
  const romSize = ROM_SIZES[romType];
  const usedSize = getTotalSize(segments);
  const usedPercentage = Math.min(100, (usedSize / romSize) * 100);
  const freeSize = Math.max(0, romSize - usedSize);
  const requiredRoms = Math.ceil(usedSize / romSize);
  const { t } = useLanguage();
  
  // Determine status color
  let statusColor = 'text-green-500';
  let bgColor = 'bg-green-500';
  
  if (usedPercentage > 90) {
    statusColor = 'text-red-500';
    bgColor = 'bg-red-500';
  } else if (usedPercentage > 70) {
    statusColor = 'text-amber-500';
    bgColor = 'bg-amber-500';
  } else if (usedPercentage > 50) {
    statusColor = 'text-blue-500';
    bgColor = 'bg-blue-500';
  }
  
  return (
    <div className="p-4 border rounded-md space-y-3 bg-card animate-fade-in">
      <h3 className="font-medium">{t('rom.usage')}</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{t('usage')}</span>
          <span className={statusColor}>{usedPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={usedPercentage} className="h-2" indicatorClassName={bgColor} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-muted-foreground">{t('used')}</div>
          <div className="font-medium">{formatBytes(usedSize)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{t('free')}</div>
          <div className="font-medium">{formatBytes(freeSize)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{t('total')}</div>
          <div className="font-medium">{formatBytes(romSize)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{t('roms.required')}</div>
          <div className={`font-medium ${requiredRoms > 1 ? 'text-amber-500' : ''}`}>
            {requiredRoms}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RomUsageStats;
