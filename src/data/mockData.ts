import type { Song, Playlist, Category } from '../types/music';

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight City Lights',
    artist: 'Neon Horizon',
    album: 'Retro Wave Dreams',
    duration: 372,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    addedAt: '2 dni temu',
    genre: 'Synthwave',
    releaseYear: 2024,
    playCount: 42,
    lyrics: [
      "Neonowe światła odbijają się w szkle wieżowców",
      "Pusta autostrada prowadzi prosto w noc",
      "Bicie syntetycznego serca wyznacza ten rytm",
      "Cienie przeszłości nikną we wstecznym lusterku",
      "Midnight City Lights nigdy nie gasną",
      "Prędkość i wolność, to wszystko co dziś mamy",
      "Do samego świtu będziemy biec za horyzont"
    ]
  },
  {
    id: 'song-2',
    title: 'Coffee & Rain',
    artist: 'Lofi Chillhop Collective',
    album: 'Study Session Vol. 3',
    duration: 423,
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    addedAt: '4 dni temu',
    genre: 'Lo-Fi',
    releaseYear: 2023,
    playCount: 29,
    lyrics: [
      "Krople deszczu stukają cicho o parapet",
      "Ciepła filiżanka kawy w dłoniach o poranku",
      "Stare winyle szumią w rogu pokoju",
      "Spokój myśli, czas na chwilę zwolnił bieg",
      "Delikatne akordy niosą się przez mgłę",
      "Zamknij oczy i po prostu bądź tu i teraz"
    ]
  },
  {
    id: 'song-3',
    title: 'Electronic Odyssey',
    artist: 'Cyber Pulse',
    album: 'Future Echoes',
    duration: 345,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    addedAt: '1 tydzień temu',
    genre: 'Elektronika',
    releaseYear: 2024,
    playCount: 57,
    lyrics: [
      "Cyfrowe fale przenikają czasoprzestrzeń",
      "Impulsy światłowodów tworzą nową symfonię",
      "Dotykamy przyszłości poprzez dźwięki maszyn",
      "Bas rezonuje głęboko pod ziemią",
      "Electronic Odyssey – podróż bez powrotu",
      "Zostawiamy stare schematy daleko za sobą"
    ]
  },
  {
    id: 'song-4',
    title: 'Sunset Boulevard',
    artist: 'The Ocean Breeze',
    album: 'Golden Hour',
    duration: 302,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    addedAt: '2 tygodnie temu',
    genre: 'Indie Pop',
    releaseYear: 2023,
    playCount: 38,
    lyrics: [
      "Złote słońce powoli topi się w oceanie",
      "Ciepły wiatr rozwiewa włosy przy brzegu",
      "Zapomnij o zmartwieniach minionego tygodnia",
      "Melodia lata unosi się nad bulwarem",
      "Chwila, która mogłaby trwać wiecznie",
      "Dźwięki gitary i szum fal w tle"
    ]
  },
  {
    id: 'song-5',
    title: 'Deep In The Groove',
    artist: 'Funk Resonance',
    album: 'Soul & Electric',
    duration: 354,
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    addedAt: '3 tygodnie temu',
    genre: 'Funk / Soul',
    releaseYear: 2022,
    playCount: 21,
    lyrics: [
      "Basowa linia wchodzi prosto w krew",
      "Klawisze rhodes dodają niesamowitego smaku",
      "Poczuj jak ciało samo zaczyna się ruszać",
      "Deep in the groove, nie zatrzymuj tego",
      "Prawdziwy funk nigdy nie umiera",
      "Rytm, który łączy nas wszystkich"
    ]
  },
  {
    id: 'song-6',
    title: 'Starlight Acoustic',
    artist: 'Maya Lin',
    album: 'Wooden Strings',
    duration: 280,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    addedAt: '1 miesiąc temu',
    genre: 'Akustyczna',
    releaseYear: 2023,
    playCount: 16,
    lyrics: [
      "Tylko drewno, struny i czysty głos",
      "Pod rozgwieżdżonym niebem w letnią noc",
      "Prawdziwe emocje bez zbędnych filtrów",
      "Każde uderzenie w strunę opowiada historię",
      "Starlight Acoustic rozświetla mrok"
    ]
  },
  {
    id: 'song-7',
    title: 'Neon Tokyo Drift',
    artist: 'Kenji Sato',
    album: 'Shibuya Nights',
    duration: 395,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    addedAt: 'Wczoraj',
    genre: 'Phonk / Trap',
    releaseYear: 2024,
    playCount: 68,
    lyrics: [
      "Skrzyżowanie Shibuya o drugiej nad ranem",
      "Ryk silników odbija się od neonowych reklam",
      "Czysta adrenalina i szybkie tempo",
      "Dryfujemy przez kręte ulice Tokio",
      "Bas trzęsie szybami w oknach",
      "Noc należy tylko do nas"
    ]
  },
  {
    id: 'song-8',
    title: 'Breathe (Ambient Flow)',
    artist: 'Serenity Project',
    album: 'Mindful Meditation',
    duration: 310,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    addedAt: '3 dni temu',
    genre: 'Ambient',
    releaseYear: 2024,
    playCount: 33,
    lyrics: [
      "Wdech... wydech... uwolnij napięcie",
      "Spokojne fale dźwięku otulają Twoje zmysły",
      "Czysta harmonia i wewnętrzny spokój",
      "Odpłyń w bezpieczną przystań dźwięków",
      "Głęboki relaks dla umysłu i ciała"
    ]
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-1',
    title: "Today's Top Hits",
    description: 'Najpopularniejsze hity z całego świata. Aktualizowane codziennie.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    gradient: 'from-emerald-800 to-emerald-950',
    songs: [INITIAL_SONGS[0], INITIAL_SONGS[2], INITIAL_SONGS[4], INITIAL_SONGS[6]]
  },
  {
    id: 'playlist-2',
    title: 'Lofi Chill Beats',
    description: 'Relaksujące bity lo-fi idealne do nauki, pracy i spokojnego wieczoru.',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
    gradient: 'from-amber-800 to-amber-950',
    songs: [INITIAL_SONGS[1], INITIAL_SONGS[5], INITIAL_SONGS[7]]
  },
  {
    id: 'playlist-3',
    title: 'Synthwave & Retrowave',
    description: 'Syntetyczne brzmienia lat 80., neonowe światła i szybka jazda nocą.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    gradient: 'from-purple-800 to-purple-950',
    songs: [INITIAL_SONGS[0], INITIAL_SONGS[2], INITIAL_SONGS[6]]
  },
  {
    id: 'playlist-4',
    title: 'Golden Sunset Vibes',
    description: 'Ciepłe, akustyczne i funkowe rytmy przy zachodzie słońca.',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    gradient: 'from-rose-800 to-rose-950',
    songs: [INITIAL_SONGS[3], INITIAL_SONGS[4], INITIAL_SONGS[5]]
  },
  {
    id: 'playlist-5',
    title: 'Deep Focus & Zen',
    description: 'Minimalistyczne dźwięki i ambient wspierające maksymalne skupienie.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    gradient: 'from-blue-800 to-blue-950',
    songs: [INITIAL_SONGS[1], INITIAL_SONGS[7]]
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    title: 'Muzyka Pop',
    color: 'bg-pink-600',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-2',
    title: 'Hip-Hop & Rap',
    color: 'bg-orange-600',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-3',
    title: 'Elektronika / Dance',
    color: 'bg-purple-600',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-4',
    title: 'Lo-Fi & Chill',
    color: 'bg-emerald-600',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-5',
    title: 'Rock & Alternatywa',
    color: 'bg-red-700',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-6',
    title: 'Trening & Fitness',
    color: 'bg-yellow-600',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-7',
    title: 'Spokojny Sen & Relaks',
    color: 'bg-indigo-700',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-8',
    title: 'Akustyczne i Folk',
    color: 'bg-amber-700',
    imageUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&auto=format&fit=crop&q=80'
  }
];
