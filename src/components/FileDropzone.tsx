
import React, { useCallback } from 'react';
import { FileIcon, Upload } from 'lucide-react';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  accept = '*',
  multiple = true,
  className = ''
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = multiple 
        ? Array.from(e.dataTransfer.files)
        : [e.dataTransfer.files[0]];
      onFilesSelected(files);
    }
  }, [multiple, onFilesSelected]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = multiple 
        ? Array.from(e.target.files)
        : [e.target.files[0]];
      onFilesSelected(files);
    }
  }, [multiple, onFilesSelected]);

  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div
      className={`
        border-2 border-dashed rounded-md transition-all duration-200 
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'} 
        hover:border-primary/50 cursor-pointer
        flex flex-col items-center justify-center p-6 text-center
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <div className="p-3 bg-secondary rounded-full mb-4">
        {isDragging ? (
          <FileIcon className="h-6 w-6 text-primary animate-pulse" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      
      <div className="space-y-1">
        <p className="font-medium text-sm">
          {isDragging ? 'Drop files here' : 'Click or drag ROM files here'}
        </p>
        <p className="text-xs text-muted-foreground">
          {multiple ? 'You can select multiple files' : 'Select a single file'}
        </p>
      </div>
    </div>
  );
};

export default FileDropzone;
