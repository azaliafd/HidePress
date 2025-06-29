import { SteganographyResult } from '../types';
import { readFileAsArrayBuffer, readFileAsDataURL } from './fileUtils';

export class LSBSteganography {
  // Hide message in image using LSB
  static async hideMessageInImage(file: File, message: string): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Convert message to binary
          const binaryMessage = message.split('').map(char => 
            char.charCodeAt(0).toString(2).padStart(8, '0')
          ).join('') + '1111111111111110'; // End marker
          
          // Check if image can hold the message
          if (binaryMessage.length > data.length / 4) {
            resolve({
              success: false,
              error: 'Message too long for this image',
              processingTime: Date.now() - startTime
            });
            return;
          }
          
          // Hide message in LSB of red channel
          for (let i = 0; i < binaryMessage.length; i++) {
            data[i * 4] = (data[i * 4] & 0xFE) | parseInt(binaryMessage[i]);
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          canvas.toBlob((blob) => {
            const resultFile = new File([blob!], `steganography_${file.name}`, { type: file.type });
            resolve({
              success: true,
              file: resultFile,
              processingTime: Date.now() - startTime
            });
          }, file.type);
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Extract message from image
  static async extractMessageFromImage(file: File): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let binaryMessage = '';
          const endMarker = '1111111111111110';
          
          // Extract LSB from red channel
          for (let i = 0; i < data.length; i += 4) {
            binaryMessage += (data[i] & 1).toString();
            
            // Check for end marker
            if (binaryMessage.length >= 16 && 
                binaryMessage.slice(-16) === endMarker) {
              break;
            }
          }
          
          // Remove end marker
          binaryMessage = binaryMessage.slice(0, -16);
          
          // Convert binary to text
          let message = '';
          for (let i = 0; i < binaryMessage.length; i += 8) {
            const byte = binaryMessage.slice(i, i + 8);
            if (byte.length === 8) {
              message += String.fromCharCode(parseInt(byte, 2));
            }
          }
          
          resolve({
            success: true,
            message: message || 'No hidden message found',
            processingTime: Date.now() - startTime
          });
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Hide message in audio (simplified - works with WAV files)
  static async hideMessageInAudio(file: File, message: string): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const view = new DataView(arrayBuffer);
      
      // Simple LSB hiding in audio data (after WAV header)
      const headerSize = 44; // Standard WAV header size
      const binaryMessage = message.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
      ).join('') + '1111111111111110'; // End marker
      
      // Check if audio can hold the message
      if (binaryMessage.length > (arrayBuffer.byteLength - headerSize)) {
        return {
          success: false,
          error: 'Message too long for this audio file',
          processingTime: Date.now() - startTime
        };
      }
      
      // Copy original data
      const newBuffer = arrayBuffer.slice(0);
      const newView = new DataView(newBuffer);
      
      // Hide message in LSB of audio samples
      for (let i = 0; i < binaryMessage.length; i++) {
        const byteIndex = headerSize + i;
        if (byteIndex < newBuffer.byteLength) {
          const originalByte = newView.getUint8(byteIndex);
          const newByte = (originalByte & 0xFE) | parseInt(binaryMessage[i]);
          newView.setUint8(byteIndex, newByte);
        }
      }
      
      const resultFile = new File([newBuffer], `steganography_${file.name}`, { type: file.type });
      
      return {
        success: true,
        file: resultFile,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Extract message from audio
  static async extractMessageFromAudio(file: File): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const view = new DataView(arrayBuffer);
      
      const headerSize = 44;
      let binaryMessage = '';
      const endMarker = '1111111111111110';
      
      // Extract LSB from audio samples
      for (let i = headerSize; i < arrayBuffer.byteLength; i++) {
        binaryMessage += (view.getUint8(i) & 1).toString();
        
        // Check for end marker
        if (binaryMessage.length >= 16 && 
            binaryMessage.slice(-16) === endMarker) {
          break;
        }
      }
      
      // Remove end marker
      binaryMessage = binaryMessage.slice(0, -16);
      
      // Convert binary to text
      let message = '';
      for (let i = 0; i < binaryMessage.length; i += 8) {
        const byte = binaryMessage.slice(i, i + 8);
        if (byte.length === 8) {
          message += String.fromCharCode(parseInt(byte, 2));
        }
      }
      
      return {
        success: true,
        message: message || 'No hidden message found',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Basic video steganography (simplified implementation)
  static async hideMessageInVideo(file: File, message: string): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      // For video files, we'll modify metadata or use a simple approach
      // This is a simplified implementation
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const newBuffer = arrayBuffer.slice(0);
      
      // Add message as metadata (simplified approach)
      const messageBytes = new TextEncoder().encode(message);
      const newArray = new Uint8Array(newBuffer.byteLength + messageBytes.length + 16);
      newArray.set(new Uint8Array(newBuffer));
      newArray.set(messageBytes, newBuffer.byteLength);
      
      const resultFile = new File([newArray], `steganography_${file.name}`, { type: file.type });
      
      return {
        success: true,
        file: resultFile,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  static async extractMessageFromVideo(file: File): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      // Simplified extraction for demo purposes
      return {
        success: true,
        message: 'Video steganography extraction is simplified in this demo',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }
}