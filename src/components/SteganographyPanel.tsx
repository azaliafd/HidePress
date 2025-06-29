import React, { useState } from 'react';
import { Eye, EyeOff, MessageSquare, Lock, Unlock, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { FilePreview } from './FilePreview';
import { LSBSteganography } from '../utils/steganography';
import { getFileType } from '../utils/fileUtils';
import { SteganographyResult } from '../types';

export const SteganographyPanel: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [extractedMessage, setExtractedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState<SteganographyResult | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setResultFile(null);
    setExtractedMessage('');
    setResult(null);
    setDebugInfo('');
  };

  const handleEncode = async () => {
    if (!originalFile || !message.trim()) return;

    setIsProcessing(true);
    setDebugInfo(`Starting encode process for ${originalFile.name}...`);
    
    const fileType = getFileType(originalFile);
    let result: SteganographyResult;

    try {
      setDebugInfo(`File type detected: ${fileType}, Message length: ${message.length} characters`);
      
      switch (fileType) {
        case 'image':
          result = await LSBSteganography.hideMessageInImage(originalFile, message);
          break;
        case 'audio':
          result = await LSBSteganography.hideMessageInAudio(originalFile, message);
          break;
        case 'video':
          result = await LSBSteganography.hideMessageInVideo(originalFile, message);
          break;
        default:
          result = {
            success: false,
            error: `Unsupported file type: ${fileType}. Supported types: image, audio, video`,
            processingTime: 0
          };
      }

      setDebugInfo(`Encode completed. Success: ${result.success}`);
      setResult(result);
      
      if (result.success && result.file) {
        setResultFile(result.file);
        setDebugInfo(`✅ Message successfully hidden! File size: ${result.file.size} bytes`);
      } else {
        setDebugInfo(`❌ Encode failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDebugInfo(`❌ Exception during encode: ${errorMessage}`);
      setResult({
        success: false,
        error: errorMessage,
        processingTime: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecode = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    setDebugInfo(`Starting decode process for ${originalFile.name}...`);
    
    const fileType = getFileType(originalFile);
    let result: SteganographyResult;

    try {
      setDebugInfo(`File type detected: ${fileType}, File size: ${originalFile.size} bytes`);
      
      switch (fileType) {
        case 'image':
          setDebugInfo(`Processing image decode...`);
          result = await LSBSteganography.extractMessageFromImage(originalFile);
          break;
        case 'audio':
          setDebugInfo(`Processing audio decode...`);
          result = await LSBSteganography.extractMessageFromAudio(originalFile);
          break;
        case 'video':
          setDebugInfo(`Processing video decode...`);
          result = await LSBSteganography.extractMessageFromVideo(originalFile);
          break;
        default:
          result = {
            success: false,
            error: `Unsupported file type: ${fileType}. Supported types: image, audio, video`,
            processingTime: 0
          };
      }

      setDebugInfo(`Decode completed. Success: ${result.success}`);
      setResult(result);
      
      if (result.success && result.message) {
        setExtractedMessage(result.message);
        setDebugInfo(`✅ Message extracted successfully! Length: ${result.message.length} characters`);
      } else if (result.success && !result.message) {
        setDebugInfo(`⚠️ Decode completed but no message found`);
      } else {
        setDebugInfo(`❌ Decode failed: ${result.error || result.message || 'Unknown error'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDebugInfo(`❌ Exception during decode: ${errorMessage}`);
      console.error('Decode error:', error);
      setResult({
        success: false,
        error: errorMessage,
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
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">LSB Steganography</h2>
            <p className="text-sm text-gray-600">Hide and extract secret messages in media files</p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setMode('encode')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              mode === 'encode'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Encode Message</span>
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              mode === 'decode'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Unlock className="w-4 h-4" />
            <span>Decode Message</span>
          </button>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            acceptedTypes="image/*,audio/*,video/*"
            title="Upload Media File"
            description="Supports images (PNG, BMP), audio (WAV, MP3), and video (MP4) files"
          />
        </div>

        {/* Message Input for Encoding */}
        {mode === 'encode' && (
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Secret Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="text-xs text-gray-500 mt-1">
              Message length: {message.length} characters
            </div>
          </div>
        )}

        {/* Debug Info Panel */}
        {debugInfo && (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Debug Information</h4>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">{debugInfo}</p>
              </div>
            </div>
          </div>
        )}

        {/* Process Button */}
        <div className="mb-6">
          <button
            onClick={mode === 'encode' ? handleEncode : handleDecode}
            disabled={isProcessing || !originalFile || (mode === 'encode' && !message.trim())}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {mode === 'encode' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>{mode === 'encode' ? 'Hide Message' : 'Extract Message'}</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className={`p-4 rounded-lg mb-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? 'Success!' : 'Error'}
              </span>
            </div>
            
            {result.error && (
              <div className="mb-2">
                <p className="text-red-700 text-sm font-medium">Error Details:</p>
                <p className="text-red-600 text-sm">{result.error}</p>
              </div>
            )}
            
            {!result.success && result.message && (
              <div className="mb-2">
                <p className="text-red-700 text-sm font-medium">Additional Info:</p>
                <p className="text-red-600 text-sm">{result.message}</p>
              </div>
            )}
            
            <div className="text-xs text-gray-600 mt-2">
              Processing time: {result.processingTime}ms
            </div>
          </div>
        )}

        {/* Extracted Message Display */}
        {mode === 'decode' && extractedMessage && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extracted Message
            </label>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-green-800 break-words font-medium">{extractedMessage}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Message length: {extractedMessage.length} characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testing Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-2">Testing Tips</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• <strong>For Encode:</strong> Upload any image/audio/video → Enter message → Click "Hide Message"</li>
                <li>• <strong>For Decode:</strong> Upload the file you got from encoding → Click "Extract Message"</li>
                <li>• <strong>Important:</strong> Only files that were processed by this tool will contain hidden messages</li>
                <li>• <strong>File Types:</strong> PNG/JPG for images, WAV/MP3 for audio, MP4 for video</li>
              </ul>
            </div>
          </div>
        </div>
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
            title="Steganography Result"
            showDownload={true}
          />
        )}
      </div>
    </div>
  );
};