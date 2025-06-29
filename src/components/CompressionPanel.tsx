import React, { useState } from 'react';
import { Archive, Minimize, Maximize, Loader, Settings } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { FilePreview } from './FilePreview';
import { MediaCompression } from '../utils/compression';
import { getFileType, formatFileSize } from '../utils/fileUtils';
import { CompressionResult } from '../types';

export const CompressionPanel: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [quality, setQuality] = useState(0.8);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setResultFile(null);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    const fileType = getFileType(originalFile);
    let result: CompressionResult;

    try {
      switch (fileType) {
        case 'image':
          result = await MediaCompression.compressImage(originalFile, quality);
          break;
        case 'audio':
          result = await MediaCompression.compressAudio(originalFile, quality);
          break;
        case 'video':
          result = await MediaCompression.compressVideo(originalFile, quality);
          break;
        default:
          result = {
            success: false,
            error: 'Unsupported file type for compression',
            originalSize: originalFile.size,
            compressedSize: 0,
            compressionRatio: 0,
            processingTime: 0
          };
      }

      setResult(result);
      if (result.success && result.file) {
        setResultFile(result.file);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        originalSize: originalFile.size,
        compressedSize: 0,
        compressionRatio: 0,
        processingTime: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecompress = async () => {
    if (!originalFile) return;

    setIsProcessing(true);

    try {
      const result = await MediaCompression.decompress(originalFile);
      setResult(result);
      if (result.success && result.file) {
        setResultFile(result.file);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        originalSize: originalFile.size,
        compressedSize: 0,
        compressionRatio: 0,
        processingTime: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Archive className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Media Compression</h2>
            <p className="text-sm text-gray-600">Compress and decompress media files</p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setMode('compress')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              mode === 'compress'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Minimize className="w-4 h-4" />
            <span>Compress</span>
          </button>
          <button
            onClick={() => setMode('decompress')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              mode === 'decompress'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Maximize className="w-4 h-4" />
            <span>Decompress</span>
          </button>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            acceptedTypes="image/*,audio/*,video/*"
            title="Upload Media File"
            description="Supports images, audio, and video files"
          />
        </div>

        {/* Quality Settings for Compression */}
        {mode === 'compress' && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Settings className="w-4 h-4 text-gray-600" />
              <label className="block text-sm font-medium text-gray-700">
                Compression Quality
              </label>
            </div>
            <div className="space-y-3">
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Lower Quality</span>
                <span className="font-medium">{Math.round(quality * 100)}%</span>
                <span>Higher Quality</span>
              </div>
            </div>
          </div>
        )}

        {/* Process Button */}
        <div className="mb-6">
          <button
            onClick={mode === 'compress' ? handleCompress : handleDecompress}
            disabled={isProcessing || !originalFile}
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {mode === 'compress' ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                <span>{mode === 'compress' ? 'Compress File' : 'Decompress File'}</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className={`p-4 rounded-lg mb-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {result.success ? (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
              <span className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? 'Success!' : 'Error'}
              </span>
            </div>
            
            {result.success && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original size:</span>
                  <span className="font-medium">{formatFileSize(result.originalSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Result size:</span>
                  <span className="font-medium">{formatFileSize(result.compressedSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size change:</span>
                  <span className={`font-medium ${result.compressionRatio > 0 ? 'text-green-600' : 'text-amber-600'}`}>
                    {result.compressionRatio > 0 ? '-' : '+'}{Math.abs(result.compressionRatio).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
            
            {result.error && (
              <p className="text-red-700 text-sm">{result.error}</p>
            )}
            
            <div className="text-xs text-gray-600 mt-2">
              Processing time: {result.processingTime}ms
            </div>
          </div>
        )}
      </div>

      {/* File Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {originalFile && (
          <FilePreview
            file={originalFile}
            title="Original File"
            showDownload={false}
          />
        )}
        {resultFile && (
          <FilePreview
            file={resultFile}
            title={`${mode === 'compress' ? 'Compressed' : 'Decompressed'} Result`}
            showDownload={true}
          />
        )}
      </div>
    </div>
  );
};