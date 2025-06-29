export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  data?: string | ArrayBuffer;
}

export interface ProcessedFile extends FileInfo {
  originalSize?: number;
  compressionRatio?: number;
  processingTime?: number;
  hasHiddenMessage?: boolean;
}

export interface SteganographyResult {
  success: boolean;
  file?: File;
  message?: string;
  processingTime: number;
  error?: string;
}

export interface CompressionResult {
  success: boolean;
  file?: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
  error?: string;
}

export type MediaType = 'image' | 'audio' | 'video';
export type ProcessType = 'steganography' | 'compression';