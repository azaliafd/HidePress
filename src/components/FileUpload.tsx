import React, { useCallback } from 'react';
import { Upload, File, Image, Music, Video } from 'lucide-react';
import { getFileType } from '../utils/fileUtils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string;
  title: string;
  description: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes,
  title,
  description
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-8 h-8" />;
    if (type.includes('audio')) return <Music className="w-8 h-8" />;
    if (type.includes('video')) return <Video className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-blue-100 text-blue-600">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="text-xs text-gray-500">
            Click to browse or drag and drop your file here
          </div>
        </div>
        
        <input
          id="file-input"
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};