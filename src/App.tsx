import React, { useState } from 'react';
import { Eye, Archive, Github, Zap } from 'lucide-react';
import { SteganographyPanel } from './components/SteganographyPanel';
import { CompressionPanel } from './components/CompressionPanel';

function App() {
  const [activeTab, setActiveTab] = useState<'steganography' | 'compression'>('steganography');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-amber-600 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HidePress</h1>
                <p className="text-xs text-gray-600">Steganography & Compression Suite</p>
              </div>
            </div>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('steganography')}
              className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all duration-200 ${
                activeTab === 'steganography'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span className="font-medium">Steganography</span>
            </button>
            <button
              onClick={() => setActiveTab('compression')}
              className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all duration-200 ${
                activeTab === 'compression'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Archive className="w-5 h-5" />
              <span className="font-medium">Compression</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'steganography' && <SteganographyPanel />}
        {activeTab === 'compression' && <CompressionPanel />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-amber-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">HidePress</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Advanced steganography and compression tools for secure media processing
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <span>LSB Algorithm</span>
              <span>•</span>
              <span>Real-time Processing</span>
              <span>•</span>
              <span>Browser-based Playback</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;