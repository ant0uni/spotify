import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { Song, Playlist, RepeatMode } from '../types/music';
import { INITIAL_PLAYLISTS, INITIAL_SONGS } from '../data/mockData';
import { synthAudioEngine } from '../utils/audioSynth';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Song[];
  currentPlaylist: Playlist | null;
  playlists: Playlist[];
  likedSongs: Song[];
  uploadedSongs: Song[];
  isLyricsOpen: boolean;
  setIsLyricsOpen: (open: boolean) => void;
  playSong: (song: Song, playlist?: Playlist) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  createPlaylist: (title: string, description: string) => Playlist;
  updatePlaylist: (playlistId: string, title: string, description: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  addUploadedSong: (song: Song) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  // Play count tracking system
  playCounts: Record<string, number>;
  getPlayCount: (songId: string) => number;
  incrementPlayCount: (songId: string) => void;
  resetPlayCounts: () => void;
  topPlayedSongs: Song[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Audio state
  const [currentSong, setCurrentSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_SONGS[0].duration);
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('spotify_volume');
    return saved !== null ? parseFloat(saved) : 0.7;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);

  // Queue and playlists
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(INITIAL_PLAYLISTS[0]);
  const [queue, setQueue] = useState<Song[]>(INITIAL_PLAYLISTS[0].songs);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('spotify_custom_playlists');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...INITIAL_PLAYLISTS, ...parsed];
      } catch {
        return INITIAL_PLAYLISTS;
      }
    }
    return INITIAL_PLAYLISTS;
  });

  const [likedSongIds, setLikedSongIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('spotify_liked_ids');
    return saved ? JSON.parse(saved) : ['song-1', 'song-2'];
  });

  const [uploadedSongs, setUploadedSongs] = useState<Song[]>([]);

  // Play count tracking system state with persistence
  const [playCounts, setPlayCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('spotify_play_counts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const initial: Record<string, number> = {};
    INITIAL_SONGS.forEach(song => {
      if (song.playCount !== undefined) {
        initial[song.id] = song.playCount;
      }
    });
    return initial;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFallbackPlayingRef = useRef<boolean>(false);
  const fallbackIntervalRef = useRef<number | null>(null);

  // Sync play counts to localStorage
  useEffect(() => {
    localStorage.setItem('spotify_play_counts', JSON.stringify(playCounts));
  }, [playCounts]);

  const getPlayCount = useCallback((songId: string): number => {
    return playCounts[songId] ?? 0;
  }, [playCounts]);

  const incrementPlayCount = useCallback((songId: string) => {
    setPlayCounts(prev => {
      const current = prev[songId] ?? 0;
      const updated = { ...prev, [songId]: current + 1 };
      localStorage.setItem('spotify_play_counts', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetPlayCounts = useCallback(() => {
    const fresh: Record<string, number> = {};
    setPlayCounts(fresh);
    localStorage.removeItem('spotify_play_counts');
  }, []);

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (!isFallbackPlayingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextTrack();
      }
    };

    const handleError = () => {
      // Audio stream failed (e.g. CORS or network error) -> start fallback audio synthesis
      console.warn('Audio URL playback failed, using Web Audio fallback');
      startFallbackAudio();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [repeatMode]);

  // Synchronize volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    synthAudioEngine.setVolume(isMuted ? 0 : volume);
    localStorage.setItem('spotify_volume', volume.toString());
  }, [volume, isMuted]);

  // Save liked songs
  useEffect(() => {
    localStorage.setItem('spotify_liked_ids', JSON.stringify(likedSongIds));
  }, [likedSongIds]);

  const startFallbackAudio = useCallback(() => {
    isFallbackPlayingRef.current = true;
    synthAudioEngine.playTrackMelody(currentSong ? currentSong.title.length : 3);
    setIsPlaying(true);

    if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);
    fallbackIntervalRef.current = window.setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 1;
        const total = currentSong?.duration || 300;
        if (next >= total) {
          if (repeatMode === 'one') {
            return 0;
          }
          handleNextTrack();
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [currentSong, repeatMode]);

  const stopFallbackAudio = useCallback(() => {
    isFallbackPlayingRef.current = false;
    synthAudioEngine.stop();
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
  }, []);

  const playSong = useCallback((song: Song, playlist?: Playlist) => {
    stopFallbackAudio();
    setCurrentSong(song);
    setDuration(song.duration);
    setCurrentTime(0);

    // Track play count for this song
    incrementPlayCount(song.id);

    if (playlist) {
      setCurrentPlaylist(playlist);
      setQueue(playlist.songs);
    }

    if (audioRef.current) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Direct play rejected/blocked, starting synth audio:', err);
        startFallbackAudio();
      });
    }
  }, [stopFallbackAudio, startFallbackAudio, incrementPlayCount]);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;

    if (isPlaying) {
      if (audioRef.current && !isFallbackPlayingRef.current) {
        audioRef.current.pause();
      }
      stopFallbackAudio();
      setIsPlaying(false);
    } else {
      if (isFallbackPlayingRef.current) {
        startFallbackAudio();
      } else if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          startFallbackAudio();
        });
      }
    }
  }, [currentSong, isPlaying, startFallbackAudio, stopFallbackAudio]);

  const handleNextTrack = useCallback(() => {
    if (!queue.length || !currentSong) return;

    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    let nextIndex = 0;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
      if (nextIndex === currentIndex && queue.length > 1) {
        nextIndex = (currentIndex + 1) % queue.length;
      }
    } else {
      if (currentIndex !== -1 && currentIndex + 1 < queue.length) {
        nextIndex = currentIndex + 1;
      } else if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // End of queue reached and repeat is off
        setIsPlaying(false);
        stopFallbackAudio();
        return;
      }
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      playSong(nextSong);
    }
  }, [queue, currentSong, isShuffle, repeatMode, playSong, stopFallbackAudio]);

  const prevTrack = useCallback(() => {
    if (!queue.length || !currentSong) return;

    if (currentTime > 4 && audioRef.current) {
      seek(0);
      return;
    }

    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    let prevIndex = 0;

    if (currentIndex > 0) {
      prevIndex = currentIndex - 1;
    } else {
      prevIndex = queue.length - 1;
    }

    const prevSong = queue[prevIndex];
    if (prevSong) {
      playSong(prevSong);
    }
  }, [queue, currentSong, currentTime, playSong]);

  const seek = useCallback((time: number) => {
    const clampedTime = Math.max(0, Math.min(duration, time));
    setCurrentTime(clampedTime);
    if (audioRef.current && !isFallbackPlayingRef.current) {
      audioRef.current.currentTime = clampedTime;
    }
  }, [duration]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (isMuted && clamped > 0) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleLike = useCallback((song: Song) => {
    setLikedSongIds(prev => {
      const exists = prev.includes(song.id);
      if (exists) {
        return prev.filter(id => id !== song.id);
      } else {
        return [...prev, song.id];
      }
    });
  }, []);

  const isLiked = useCallback((songId: string) => {
    return likedSongIds.includes(songId);
  }, [likedSongIds]);

  const createPlaylist = useCallback((title: string, description: string): Playlist => {
    const gradients = [
      'from-purple-800 to-indigo-950',
      'from-rose-800 to-pink-950',
      'from-emerald-800 to-teal-950',
      'from-amber-800 to-yellow-950',
      'from-blue-800 to-cyan-950'
    ];
    const newPlaylist: Playlist = {
      id: `playlist-custom-${Date.now()}`,
      title: title || 'Moja playlista',
      description: description || 'Stworzona przez Ciebie',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      songs: [],
      isCustom: true
    };

    setPlaylists(prev => {
      const customOnly = prev.filter(p => p.isCustom);
      const updatedCustom = [...customOnly, newPlaylist];
      localStorage.setItem('spotify_custom_playlists', JSON.stringify(updatedCustom));
      return [...prev, newPlaylist];
    });

    return newPlaylist;
  }, []);

  const addSongToPlaylist = useCallback((playlistId: string, song: Song) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id === playlistId) {
          if (p.songs.some(s => s.id === song.id)) return p;
          return { ...p, songs: [...p.songs, song] };
        }
        return p;
      });
      const customOnly = updated.filter(p => p.isCustom);
      localStorage.setItem('spotify_custom_playlists', JSON.stringify(customOnly));
      return updated;
    });
  }, []);

  const updatePlaylist = useCallback((playlistId: string, title: string, description: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id === playlistId) {
          return { ...p, title, description };
        }
        return p;
      });
      const customOnly = updated.filter(p => p.isCustom);
      localStorage.setItem('spotify_custom_playlists', JSON.stringify(customOnly));
      return updated;
    });
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => {
      const updated = prev.filter(p => p.id !== playlistId);
      const customOnly = updated.filter(p => p.isCustom);
      localStorage.setItem('spotify_custom_playlists', JSON.stringify(customOnly));
      return updated;
    });
    setCurrentPlaylist(prev => (prev?.id === playlistId ? null : prev));
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id === playlistId) {
          return { ...p, songs: p.songs.filter(s => s.id !== songId) };
        }
        return p;
      });
      const customOnly = updated.filter(p => p.isCustom);
      localStorage.setItem('spotify_custom_playlists', JSON.stringify(customOnly));
      return updated;
    });
  }, []);

  const addUploadedSong = useCallback((song: Song) => {
    setUploadedSongs(prev => [song, ...prev]);
    setQueue(prev => [song, ...prev]);
    playSong(song);
  }, [playSong]);

  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    if (currentSong) {
      setQueue([currentSong]);
    } else {
      setQueue([]);
    }
  }, [currentSong]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
      if (isInput) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + 5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(currentTime - 5);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(volume - 0.05);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek, currentTime, setVolume, volume, toggleMute]);

  // Compute all available songs (including uploaded)
  const allKnownSongs = [...INITIAL_SONGS, ...uploadedSongs];
  const likedSongs = allKnownSongs.filter(s => likedSongIds.includes(s.id));

  // Dynamically compute top played songs based on persistent play counters
  const topPlayedSongs = [...allKnownSongs].sort((a, b) => {
    const countA = playCounts[a.id] ?? a.playCount ?? 0;
    const countB = playCounts[b.id] ?? b.playCount ?? 0;
    return countB - countA;
  });

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        currentPlaylist,
        playlists,
        likedSongs,
        uploadedSongs,
        isLyricsOpen,
        setIsLyricsOpen,
        playSong,
        togglePlay,
        nextTrack: handleNextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        isLiked,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        addUploadedSong,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playCounts,
        getPlayCount,
        incrementPlayCount,
        resetPlayCounts,
        topPlayedSongs
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
