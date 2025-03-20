
import React, { useState, useRef, useEffect } from 'react';
import { RomSegment } from '@/lib/romUtils';

interface HexEditorProps {
  segment: RomSegment;
  className?: string;
}

const HexEditor: React.FC<HexEditorProps> = ({ segment, className }) => {
  const [selectedByte, setSelectedByte] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bytesPerRow = 16;
  
  // Calculate the number of rows needed
  const rowCount = Math.ceil(segment.data.length / bytesPerRow);
  
  // Create an array of row indices
  const rows = Array.from({ length: rowCount }, (_, i) => i);
  
  const handleByteClick = (index: number) => {
    setSelectedByte(index === selectedByte ? null : index);
  };
  
  // Format the address of a row as hexadecimal
  const formatAddress = (rowIndex: number): string => {
    const address = rowIndex * bytesPerRow;
    return address.toString(16).toUpperCase().padStart(8, '0');
  };
  
  // Get the bytes for a specific row
  const getRowBytes = (rowIndex: number): number[] => {
    const startIndex = rowIndex * bytesPerRow;
    const endIndex = Math.min(startIndex + bytesPerRow, segment.data.length);
    
    return Array.from(segment.data.slice(startIndex, endIndex));
  };
  
  // Format a byte as a two-digit hexadecimal value
  const formatByte = (byte: number): string => {
    return byte.toString(16).toUpperCase().padStart(2, '0');
  };
  
  // Get ASCII representation of a byte (if printable)
  const getAscii = (byte: number): string => {
    return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.';
  };
  
  useEffect(() => {
    // Reset selected byte when segment changes
    setSelectedByte(null);
  }, [segment]);
  
  return (
    <div className={`font-mono text-sm ${className}`}>
      {segment.type === 'blank' ? (
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <p className="text-lg mb-2">Blank Space</p>
          <p>Size: {segment.size.toLocaleString()} bytes</p>
          <p>Filled with: {segment.data[0] === 0 ? '0x00' : '0xFF'}</p>
        </div>
      ) : (
        <div className="animate-fade-in relative">
          <div className="sticky top-0 bg-card z-10 pb-2 border-b mb-2 flex">
            <div className="w-24 flex-shrink-0 font-semibold text-muted-foreground">Address</div>
            <div className="flex-1 font-semibold text-muted-foreground">Hexadecimal</div>
            <div className="w-36 ml-4 font-semibold text-muted-foreground">ASCII</div>
          </div>
          
          <div ref={containerRef} className="overflow-auto max-h-[500px] p-1">
            {rows.map(rowIndex => (
              <div key={rowIndex} className="flex mb-1 group hover:bg-muted/30 rounded px-1">
                <div className="w-24 flex-shrink-0 text-muted-foreground">
                  {formatAddress(rowIndex)}
                </div>
                
                <div className="flex-1 flex flex-wrap">
                  {getRowBytes(rowIndex).map((byte, byteIndex) => {
                    const bytePosition = rowIndex * bytesPerRow + byteIndex;
                    const isSelected = selectedByte === bytePosition;
                    
                    return (
                      <span
                        key={byteIndex}
                        className={`mx-1 cursor-pointer px-1 rounded 
                          ${isSelected ? 'bg-primary text-primary-foreground' : ''} 
                          ${byte === 0 ? 'text-blue-500/60' : ''}
                          ${byte === 0xff ? 'text-red-500/60' : ''}
                        `}
                        onClick={() => handleByteClick(bytePosition)}
                      >
                        {formatByte(byte)}
                      </span>
                    );
                  })}
                </div>
                
                <div className="w-36 ml-4 font-mono">
                  {getRowBytes(rowIndex).map((byte, i) => getAscii(byte)).join('')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HexEditor;
