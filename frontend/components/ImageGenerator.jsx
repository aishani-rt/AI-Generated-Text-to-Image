import React, { useState, useRef } from 'react';
import axios from 'axios';
import LoadingAnimation from './LoadingAnimation';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Realistic');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const imageRef = useRef(null);

  const styles = [
    'Realistic',
    'Anime',
    'Cyberpunk',
    'Oil Painting',
    'Sketch',
    'Digital Art',
    'Watercolor',
    'Comic Book'
  ];

  const handleGenerateImage = async () => {
    // Validation
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (prompt.trim().length > 500) {
      setError('Prompt is too long (max 500 characters)');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${API_URL}/generate`,
        {
          prompt: prompt.trim(),
          style: style
        },
        {
          timeout: 120000, // 2 minutes
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.image) {
        // Convert Base64 to image URL
        const imageData = `data:image/png;base64,${response.data.image}`;
        setImage(imageData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      let errorMessage = 'Failed to generate image';

      if (err.response?.status === 400) {
        errorMessage = err.response.data?.error || 'Invalid input';
      } else if (err.response?.status === 504) {
        errorMessage = 'Image generation timed out. Try a simpler prompt.';
      } else if (err.response?.status === 503) {
        errorMessage = 'Image service temporarily unavailable';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Cannot connect to backend. Is it running?';
      }

      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!image) return;

    try {
      const link = document.createElement('a');
      link.href = image;
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download image');
      console.error('Download error:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerateImage();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            ✨ AI Image Generator
          </h1>
          <p className="text-gray-300 text-lg">
            Transform your imagination into stunning visuals
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
          {/* Left Side - Input */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Your Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the image you want to generate... (e.g., 'a futuristic city at sunset with flying cars')"
                maxLength={500}
                className="w-full h-24 p-4 bg-slate-700 text-white rounded-lg border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none resize-none transition-colors placeholder-gray-400"
                disabled={loading}
              />
              <div className="text-sm text-gray-400 mt-1">
                {prompt.length}/500 characters
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Art Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors"
                disabled={loading}
              >
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGenerateImage}
                disabled={loading || !prompt.trim()}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                  loading || !prompt.trim()
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </span>
                ) : (
                  '🎨 Generate Image'
                )}
              </button>

              {image && (
                <button
                  onClick={handleDownloadImage}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors active:scale-95"
                >
                  📥 Download Image
                </button>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
              <p className="font-semibold mb-2">💡 Pro Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Be specific with your description</li>
                <li>Try different styles for the same prompt</li>
                <li>Include adjectives (beautiful, dark, vibrant)</li>
                <li>Generation takes 10-30 seconds</li>
              </ul>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="space-y-6">
            {/* Image Display */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Generated Image
              </label>
              <div className="relative w-full aspect-square bg-slate-700 rounded-lg border-2 border-purple-500/30 overflow-hidden">
                {loading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <LoadingAnimation />
                    <p className="text-gray-300 mt-4">
                      Creating your masterpiece...
                    </p>
                  </div>
                ) : image ? (
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="text-5xl mb-4">🎨</div>
                    <p>Your image will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-2 min-h-16">
              {error && <ErrorMessage message={error} />}
              {success && (
                <SuccessMessage 
                  message={image ? 'Image generated successfully!' : 'Copied to clipboard!'} 
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Powered by AI • Image generation takes 10-30 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;