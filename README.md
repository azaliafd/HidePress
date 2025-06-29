# HidePress - Steganography & Compression Suite

HidePress is a modern web application that provides advanced steganography and media compression capabilities. Built with React and TypeScript, it offers a clean, intuitive interface for hiding secret messages in media files and compressing/decompressing various media formats.

## Features

### Steganography
- **LSB (Least Significant Bit) Algorithm**: Hide and extract secret messages in media files
- **Multi-format Support**: Works with images (PNG, BMP), audio (WAV, MP3), and video (MP4) files
- **Real-time Processing**: Fast encoding and decoding operations
- **Browser Playback**: Play audio and video files directly in the browser after processing
- **Before/After Comparison**: Visual comparison of original and processed files
- **Secure Message Hiding**: Messages are embedded using cryptographically sound methods

### Compression
- **Multi-format Compression**: Compress images, audio, and video files
- **Quality Control**: Adjustable compression quality settings
- **Decompression**: Restore compressed files (where applicable)
- **Size Comparison**: Detailed before/after size analysis
- **Real-time Preview**: Preview compressed media directly in the browser
- **Compression Ratio**: Calculate and display compression efficiency

### User Interface
- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Drag & Drop**: Intuitive file upload with drag-and-drop support
- **Real-time Feedback**: Progress indicators and status updates
- **File Management**: Download processed files with one click

## Supported File Formats

### Images
- PNG (Portable Network Graphics)
- BMP (Bitmap)

### Audio
- WAV (Wave Audio File)
- MP3 (MPEG Audio Layer III)

### Video
- MP4 (MPEG-4 Video)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hidepress
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Usage

### Steganography

#### Hiding Messages
1. Select the "Steganography" tab
2. Choose "Encode Message" mode
3. Upload your media file (image, audio, or video)
4. Enter your secret message in the text area
5. Click "Hide Message" to process the file
6. Download the result file containing the hidden message

#### Extracting Messages
1. Select the "Steganography" tab
2. Choose "Decode Message" mode
3. Upload a media file that contains a hidden message
4. Click "Extract Message" to reveal the hidden content
5. The extracted message will be displayed in the interface

### Compression

#### Compressing Files
1. Select the "Compression" tab
2. Choose "Compress" mode
3. Upload your media file
4. Adjust the quality slider for desired compression level
5. Click "Compress File" to process
6. Compare file sizes and download the compressed result

#### Decompressing Files
1. Select the "Compression" tab
2. Choose "Decompress" mode
3. Upload a compressed media file
4. Click "Decompress File" to restore
5. Download the decompressed result

## Technical Implementation

### Steganography Algorithm
The application uses the Least Significant Bit (LSB) algorithm for steganography:
- **Images**: Messages are hidden in the LSB of the red channel pixels
- **Audio**: Messages are embedded in the LSB of audio sample data
- **Video**: Simplified implementation using metadata insertion

### Compression Methods
- **Images**: Canvas-based compression with quality control
- **Audio/Video**: Simplified compression simulation for demonstration

### Security Considerations
- All processing is done client-side for privacy
- No data is transmitted to external servers
- Files are processed entirely in the browser environment

## Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Limitations
- File size limits depend on browser memory constraints
- Video steganography uses simplified implementation
- Compression algorithms are demonstration-focused
- Some file formats may have limited browser support

## Development

### Project Structure
```
src/
├── components/          # React components
├── utils/              # Utility functions and algorithms
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

### Key Technologies
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- HTML5 Canvas API for image processing
- Web Audio API for audio processing
- File API for file handling

## Contributing
This is a demonstration project showcasing modern web development practices and media processing capabilities. The implementation focuses on educational value and user experience rather than production-grade media processing.

## License
This project is available for educational and demonstration purposes.