import { CompressionResult } from '../types';
import { readFileAsArrayBuffer } from './fileUtils';

export class MediaCompression {
  // Compress image using canvas
  static async compressImage(file: File, quality: number = 0.8): Promise<CompressionResult> {
    const startTime = Date.now();
    const originalSize = file.size;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          // Calculate new dimensions (optional scaling)
          const maxDimension = 2048;
          let { width, height } = img;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob!], `compressed_${file.name}`, { type: 'image/jpeg' });
            const compressedSize = compressedFile.size;
            const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
            
            resolve({
              success: true,
              file: compressedFile,
              originalSize,
              compressedSize,
              compressionRatio,
              processingTime: Date.now() - startTime
            });
          }, 'image/jpeg', quality);
        };
        
        img.onerror = () => {
          resolve({
            success: false,
            error: 'Failed to load image',
            originalSize,
            compressedSize: 0,
            compressionRatio: 0,
            processingTime: Date.now() - startTime
          });
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        originalSize,
        compressedSize: 0,
        compressionRatio: 0,
        processingTime: Date.now() - startTime
      };
    }
  }

  // Simple audio compression simulation
  static async compressAudio(file: File, quality: number = 0.8): Promise<CompressionResult> {
    const startTime = Date.now();
    const originalSize = file.size;
    
    try {
      // For demo purposes, we'll simulate compression by reducing file size
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const compressionFactor = quality;
      const targetSize = Math.floor(arrayBuffer.byteLength * compressionFactor);
      
      // Simple byte reduction (not actual audio compression)
      const compressedBuffer = arrayBuffer.slice(0, targetSize);
      const compressedFile = new File([compressedBuffer], `compressed_${file.name}`, { type: file.type });
      
      const compressedSize = compressedFile.size;
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
      
      return {
        success: true,
        file: compressedFile,
        originalSize,
        compressedSize,
        compressionRatio,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        originalSize,
        compressedSize: 0,
        compressionRatio: 0,
        processingTime: Date.now() - startTime
      };
    }
  }

  // Simple video compression simulation
  static async compressVideo(file: File, quality: number = 0.8): Promise<CompressionResult> {
    const startTime = Date.now();
    const originalSize = file.size;
    
    try {
      // For demo purposes, simulate compression
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const compressionFactor = quality;
      const targetSize = Math.floor(arrayBuffer.byteLength * compressionFactor);
      
      const compressedBuffer = arrayBuffer.slice(0, targetSize);
      const compressedFile = new File([compressedBuffer], `compressed_${file.name}`, { type: file.type });
      
      const compressedSize = compressedFile.size;
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
      
      return {
        success: true,
        file: compressedFile,
        originalSize,
        compressedSize,
        compressionRatio,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        originalSize,
        compressedSize: 0,
        compressionRatio: 0,
        processingTime: Date.now() - startTime
      };
    }
  }

  // Decompress (restore original quality - simplified)
  static async decompress(file: File): Promise<CompressionResult> {
    const startTime = Date.now();
    const originalSize = file.size;
    
    try {
      // For demo purposes, simulate decompression by creating a larger file
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const expansionFactor = 1.2; // Simulate expansion
      const expandedSize = Math.floor(arrayBuffer.byteLength * expansionFactor);
      
      const expandedBuffer = new ArrayBuffer(expandedSize);
      const expandedView = new Uint8Array(expandedBuffer);
      const originalView = new Uint8Array(arrayBuffer);
      
      // Copy original data and pad
      expandedView.set(originalView);
      
      const decompressedFile = new File([expandedBuffer], `decompressed_${file.name}`, { type: file.type });
      const decompressedSize = decompressedFile.size;
      const expansionRatio = ((decompressedSize - originalSize) / originalSize) * 100;
      
      return {
        success: true,
        file: decompressedFile,
        originalSize,
        compressedSize: decompressedSize,
        compressionRatio: -expansionRatio, // Negative indicates expansion
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        originalSize,
        compressedSize: 0,
        compressionRatio: 0,
        processingTime: Date.now() - startTime
      };
    }
  }
}