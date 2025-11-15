'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  eventName: string;
}

export default function AudioPlayer({ audioUrl, eventName }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
    const [waveHeights] = useState(() =>
  Array.from({ length: 40 }, () => Math.random() * 60 + 20)
);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-6 shadow-lg">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Título */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Mensaje de Audio
        </h3>
        <p className="text-sm text-gray-600">{eventName}</p>
      </div>

      {/* Visualización de onda (decorativa) */}
      <div className="mb-6 flex items-center justify-center gap-1 h-20">
        {waveHeights.length > 0 ? ( // ✅ Cambio 3: Renderizar solo cuando hay alturas
          waveHeights.map((height, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-gradient-to-t from-purple-600 to-blue-600 animate-pulse'
                  : 'bg-gray-300'
              }`}
              style={{
                height: `${height}%`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))
        ) : (
          // ✅ Placeholder mientras se generan las alturas
          <div className="flex items-center justify-center gap-1 h-20">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1/2 bg-gray-300 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Controles principales */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* Botón de reproducción */}
        <button
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #9333ea 0%, #3b82f6 ${
              (currentTime / duration) * 100
            }%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control de volumen */}
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}