import React, { useRef, useState } from 'react';
import { Play, Pause, Upload, Clock, HardDrive, Headphones } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackRow } from '../Common/TrackRow';
import { formatTotalDuration } from '../../utils/formatTime';
import type { Song } from '../../types/music';

export const UploadedSongsView: React.FC = () => {
  const { uploadedSongs, currentSong, isPlaying, playSong, togglePlay, addUploadedSong } = usePlayer();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isUploadedPlaying = isPlaying && uploadedSongs.some(s => s.id === currentSong?.id);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const audioUrl = URL.createObjectURL(file);
      const tempAudio = new Audio(audioUrl);

      tempAudio.addEventListener('loadedmetadata', () => {
        const rawName = file.name.replace(/\.[^/.]+$/, "");
        const parts = rawName.split(' - ');
        const artist = parts.length > 1 ? parts[0].trim() : 'Własny plik';
        const title = parts.length > 1 ? parts.slice(1).join(' - ').trim() : rawName;

        const newSong: Song = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: title,
          artist: artist,
          album: 'Wgrane z dysku',
          duration: Math.round(tempAudio.duration) || 200,
          coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
          audioUrl: audioUrl,
          addedAt: 'Przed chwilą',
          isLocal: true
        };

        addUploadedSong(newSong);
      });
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 overflow-y-auto pb-28 select-none transition-colors ${
        isDragging ? 'bg-emerald-950/30' : ''
      }`}
    >
      {/* Hero Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-teal-900 via-teal-950 to-[#121212] flex flex-col sm:flex-row items-end gap-6">
        <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-800 flex items-center justify-center shadow-2xl flex-shrink-0">
          <HardDrive className="w-20 h-20 text-white" />
        </div>

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <span className="text-xs uppercase font-bold tracking-wider text-white/80">
            Pliki Lokalne
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none truncate py-1">
            Wgrane z dysku
          </h1>
          <p className="text-sm text-neutral-300 mt-2">
            Muzyka odtwarzana bezpośrednio z Twojego komputera. Pliki nie są wysyłane na żaden serwer.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90 mt-2">
            <span className="text-white font-bold">Twój komputer</span>
            <span>•</span>
            <span>{uploadedSongs.length} utworów</span>
            {uploadedSongs.length > 0 && (
              <>
                <span>•</span>
                <span className="text-neutral-300">{formatTotalDuration(uploadedSongs)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 sm:px-8 py-5 flex items-center gap-4 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
        <button
          onClick={() => {
            if (uploadedSongs.length > 0) {
              if (isUploadedPlaying) togglePlay();
              else playSong(uploadedSongs[0]);
            }
          }}
          disabled={uploadedSongs.length === 0}
          className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-2xl transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          title={isUploadedPlaying ? "Wstrzymaj" : "Odtwórz wgrane utwory"}
        >
          {isUploadedPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          )}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-600 hover:border-white text-white font-bold text-sm hover:scale-105 active:scale-95 transition"
        >
          <Upload className="w-4 h-4 text-[#1ed760]" />
          <span>Wybierz pliki MP3 / WAV</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Drag & drop helper / Song list */}
      <div className="px-4 sm:px-8 pt-4">
        {uploadedSongs.length > 0 ? (
          <div>
            <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2.5fr_1.5fr_auto] lg:grid-cols-[16px_4fr_2.5fr_1.5fr_1.5fr_auto] gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              <span className="text-center">#</span>
              <span>Tytuł</span>
              <span className="hidden md:block">Album</span>
              <span className="hidden md:flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5" /> Odtworzenia
              </span>
              <span className="hidden lg:block">Data dodania</span>
              <div className="flex justify-end pr-8">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-0.5">
              {uploadedSongs.map((song, idx) => (
                <TrackRow
                  key={song.id}
                  song={song}
                  index={idx}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-700 hover:border-[#1ed760] rounded-2xl p-12 text-center cursor-pointer transition bg-white/5 hover:bg-white/10"
          >
            <Upload className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Przeciągnij i upuść pliki muzyczne tutaj
            </h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mb-5">
              Obsługuje formaty MP3, WAV, FLAC, AAC, OGG. Pliki natychmiast pojawią się w Twojej bibliotece.
            </p>
            <button className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition">
              Przeglądaj pliki
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
