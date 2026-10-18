import React, { useState } from 'react';
import { X, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import type { Playlist } from '../../types/music';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated: (playlist: Playlist) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated
}) => {
  const { createPlaylist } = usePlayer();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPlaylist = createPlaylist(title.trim(), description.trim());
    setTitle('');
    setDescription('');
    onPlaylistCreated(newPlaylist);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-[#282828] text-white rounded-xl w-full max-w-md p-6 shadow-2xl border border-neutral-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
          aria-label="Zamknij"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
          <Music className="w-6 h-6 text-green-500" />
          Utwórz nową playlistę
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
              Nazwa playlisty
            </label>
            <input
              type="text"
              placeholder="np. Moje ulubione hity"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#3e3e3e] text-white px-3 py-2.5 rounded-md border border-transparent focus:border-white focus:outline-none text-sm transition"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
              Opis (opcjonalnie)
            </label>
            <textarea
              placeholder="Dodaj opcjonalny opis playlisty..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#3e3e3e] text-white px-3 py-2 rounded-md border border-transparent focus:border-white focus:outline-none text-sm transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full font-bold text-sm text-neutral-300 hover:text-white transition"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2 rounded-full font-bold text-sm bg-green-500 text-black hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:hover:scale-100"
            >
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
