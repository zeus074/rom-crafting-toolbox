
import React from 'react';
import { RomSegment, formatBytes } from '@/lib/romUtils';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Trash2, FileIcon, Square } from 'lucide-react';

interface SegmentListProps {
  segments: RomSegment[];
  selectedSegmentId: string | null;
  onSelectSegment: (id: string) => void;
  onRemoveSegment: (id: string) => void;
  onMoveSegment: (id: string, direction: 'up' | 'down') => void;
}

const SegmentList: React.FC<SegmentListProps> = ({
  segments,
  selectedSegmentId,
  onSelectSegment,
  onRemoveSegment,
  onMoveSegment,
}) => {
  if (segments.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed rounded-md bg-secondary/30 text-muted-foreground animate-fade-in">
        <p>No ROM segments added yet</p>
        <p className="text-sm mt-2">Use the buttons above to add ROM files or blank space</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {segments.map((segment, index) => (
        <div 
          key={segment.id}
          className={`rom-item flex items-center ${selectedSegmentId === segment.id ? 'active' : ''}`}
          onClick={() => onSelectSegment(segment.id)}
        >
          {/* Icon based on segment type */}
          <div className="mr-3 text-muted-foreground">
            {segment.type === 'file' ? (
              <FileIcon size={18} />
            ) : (
              <Square size={18} />
            )}
          </div>
          
          {/* Segment info */}
          <div className="flex-1">
            <div className="font-medium">{segment.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{formatBytes(segment.size)}</span>
              {segment.type === 'blank' && (
                <span className="px-1.5 py-0.5 bg-secondary rounded-sm text-xs">
                  Fill: {segment.data[0] === 0 ? '0x00' : '0xFF'}
                </span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                onMoveSegment(segment.id, 'up');
              }}
            >
              <ChevronUp size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              disabled={index === segments.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                onMoveSegment(segment.id, 'down');
              }}
            >
              <ChevronDown size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSegment(segment.id);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SegmentList;
