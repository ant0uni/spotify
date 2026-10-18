export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  addedAt?: string;
  isLocal?: boolean;
  genre?: string;
  releaseYear?: number;
  lyrics?: string[];
  playCount?: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  gradient: string; // CSS gradient for header
  songs: Song[];
  isCustom?: boolean;
}

export interface Category {
  id: string;
  title: string;
  color: string;
  imageUrl: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export type CurrentView = 
  | { type: 'home' }
  | { type: 'search' }
  | { type: 'playlist'; playlistId: string }
  | { type: 'liked' }
  | { type: 'uploaded' }
  | { type: 'stats' };

