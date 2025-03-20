
// ROM size definitions (in bytes)
export const ROM_SIZES = {
  '27C16': 2 * 1024,        // 2KB
  '27C32': 4 * 1024,        // 4KB
  '27C64': 8 * 1024,        // 8KB
  '27C128': 16 * 1024,      // 16KB
  '27C256': 32 * 1024,      // 32KB
  '27C512': 64 * 1024,      // 64KB
  '27C010': 128 * 1024,     // 128KB
  '27C020': 256 * 1024,     // 256KB
};

export type RomType = keyof typeof ROM_SIZES;

export const BLANK_SPACE_SIZES = {
  '1KB': 1 * 1024,
  '2KB': 2 * 1024,
  '4KB': 4 * 1024,
  '8KB': 8 * 1024,
  '16KB': 16 * 1024,
  '32KB': 32 * 1024,
  '64KB': 64 * 1024,
  '128KB': 128 * 1024,
  '256KB': 256 * 1024,
};

export type BlankSpaceSize = keyof typeof BLANK_SPACE_SIZES;

export type FillType = 0x00 | 0xFF;

export interface RomSegment {
  id: string;
  name: string;
  type: 'file' | 'blank';
  size: number;
  data: Uint8Array;
}

export interface RomProject {
  name: string;
  romType: RomType;
  fillType: FillType;
  segments: RomSegment[];
}

// Helper to create a new blank segment
export const createBlankSegment = (size: number, fillType: FillType): Uint8Array => {
  const blank = new Uint8Array(size);
  blank.fill(fillType);
  return blank;
};

// Format bytes to human-readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Calculate total size of all segments
export const getTotalSize = (segments: RomSegment[]): number => {
  return segments.reduce((total, segment) => total + segment.size, 0);
};

// Create file from segments
export const createRomFile = (
  segments: RomSegment[],
  romType: RomType,
  fillType: FillType
): Uint8Array[] => {
  const romSize = ROM_SIZES[romType];
  const totalData = concatenateSegments(segments);
  
  // If total data fits in one ROM
  if (totalData.length <= romSize) {
    const romFile = new Uint8Array(romSize);
    romFile.fill(fillType); // Fill with requested pattern
    romFile.set(totalData); // Copy data
    return [romFile];
  }
  
  // If we need multiple ROMs, split the data
  const romCount = Math.ceil(totalData.length / romSize);
  const result: Uint8Array[] = [];
  
  for (let i = 0; i < romCount; i++) {
    const romFile = new Uint8Array(romSize);
    romFile.fill(fillType);
    
    const start = i * romSize;
    const end = Math.min((i + 1) * romSize, totalData.length);
    const slice = totalData.slice(start, end);
    
    romFile.set(slice);
    result.push(romFile);
  }
  
  return result;
};

// Concatenate all segments into a single data array
export const concatenateSegments = (segments: RomSegment[]): Uint8Array => {
  const totalSize = getTotalSize(segments);
  const result = new Uint8Array(totalSize);
  let offset = 0;
  
  segments.forEach(segment => {
    result.set(segment.data, offset);
    offset += segment.size;
  });
  
  return result;
};

// Function to read file as Uint8Array
export const readFileAsUint8Array = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    
    reader.onerror = () => {
      reject(reader.error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Download a file
export const downloadFile = (data: Uint8Array, filename: string): void => {
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Format a Uint8Array as hex string for display
export const formatHexDisplay = (data: Uint8Array, bytesPerLine = 16): string[] => {
  const lines: string[] = [];
  
  for (let i = 0; i < data.length; i += bytesPerLine) {
    const bytes = Array.from(data.slice(i, i + bytesPerLine))
      .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
    
    const address = i.toString(16).padStart(8, '0').toUpperCase();
    lines.push(`${address}: ${bytes}`);
  }
  
  return lines;
};

// Save project to JSON file
export const saveProject = (project: RomProject): string => {
  // Convert Uint8Arrays to base64 strings for JSON serialization
  const serializable = {
    ...project,
    segments: project.segments.map(seg => ({
      ...seg,
      data: Array.from(seg.data) // Convert to regular array for JSON
    }))
  };
  
  return JSON.stringify(serializable, null, 2);
};

// Load project from JSON
export const loadProject = (json: string): RomProject => {
  const parsed = JSON.parse(json);
  
  return {
    ...parsed,
    segments: parsed.segments.map((seg: any) => ({
      ...seg,
      data: new Uint8Array(seg.data) // Convert back to Uint8Array
    }))
  };
};
