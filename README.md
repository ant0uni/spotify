# 🎵 Spotify Clone (Web Player)

Nowoczesna aplikacja webowa inspirowana serwisem **Spotify**, zbudowana przy użyciu **React 19**, **TypeScript**, **Vite** i **Tailwind CSS**. Aplikacja oferuje pełne doświadczenie odtwarzacza muzycznego, zarządzanie playlistami, wyszukiwanie utworów oraz **zaawansowany system zliczania odsłuchań** z dedykowanym widokiem statystyk w stylu *Spotify Wrapped*.

![Spotify Clone](https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Główne Funkcje

### 🎧 1. Odtwarzacz Muzyki (Audio Player)
- **Pełne sterowanie**: Play / Pause, Następny / Poprzedni utwór, Przewijanie (seek bar), Regulacja głośności z wyciszeniem.
- **Tryby odtwarzania**: Odtwarzanie losowe (*Shuffle*) oraz powtarzanie (*Repeat All / Repeat One*).
- **Niezawodność dźwięku**: Automatyczny silnik syntezy dźwięku (*Web Audio API fallback*), gwarantujący płynne i słyszalne odtwarzanie nawet offline lub przy blokadzie strumieni zewnętrznych.
- **Skróty klawiszowe**:
  - `Spacja` – Odtwarzaj / Wstrzymaj
  - `Strzałka w lewo / w prawo` – Przewijanie utworu o 5 sekund
  - `Strzałka w górę / w dół` – Zmiana głośności
  - `M` – Wyciszenie dźwięku (Mute)
  - `Esc` – Zamknięcie modalu z tekstem

### 📊 2. Licznik Odsłuchań (Play Counter & Analytics)
- **Precyzyjne zliczanie**: Każde uruchomienie lub przesłuchanie piosenki automatycznie zwiększa jej licznik odtworzeń.
- **Trwałość danych**: Liczniki są automatycznie zapisywane w pamięci przeglądarki (`localStorage`).
- **Wskaźniki odsłuchań**:
  - Liczba odsłuchań w każdym wierszu tabeli utworów (`TrackRow`).
  - Mini-odznaka w dolnym pasku odtwarzacza (`TrackInfo`).
  - Wskaźniki w wynikach wyszukiwania i kolejce utworów.
- **🔥 Sekcja "Najczęściej słuchane (On Repeat)"**:
  - Dynamicznie generowana lista najpopularniejszych utworów na stronie głównej z medalami `#1`, `#2`, `#3`.
- **Dedykowany widok "Twoje Statystyki" (Spotify Wrapped Live)**:
  - Łączna liczba odsłuchań i całkowity czas spędzony z muzyką.
  - Wykresy słuchalności i wizualne paski popularności poszczególnych utworów.
  - Podział na ulubione gatunki muzyczne (Synthwave, Lo-Fi, Funk, Elektronika, Ambient).
  - Opcja resetowania liczników.

### 📁 3. Tworzenie i Zarządzanie Playlistami
- **Tworzenie własnych playlist**: Modal tworzenia z własnym tytułem, opisem i generowanymi gradientami.
- **Edycja playlist**: Zmiana nazwy i opisu bezpośrednio w widoku playlisty.
- **Dodawanie utworów**: Menu podręczne (⋮) przy każdym utworze pozwala dodać go do dowolnej playlisty.
- **Usuwanie utworów i playlist**: Bezproblemowe usuwanie utworów z własnych list oraz usuwanie całych playlist.
- **Automatyczne rekomendacje**: Propozycje utworów do dodania dla pustych lub krótkich playlist.

### 🔍 4. Wyszukiwanie Utworów (Search View)
- **Błyskawiczne filtrowanie na żywo**: Wyszukiwanie po tytule, wykonawcy, albumie i gatunku.
- **Filtry wyników**: Przełączanie między "Wszystko", "Utwory", "Playlisty" oraz "Najczęściej słuchane".
- **Karty gatunków**: Kolorowe kafelki kategorii muzycznych (Pop, Hip-Hop, Lo-Fi, Elektronika, Rock, Ambient) filtrujące zawartość po jednym kliknięciu.

### 💾 5. Wgrywanie Własnych Plików Muzycznych (Local Files)
- Obsługa plików **MP3, WAV, FLAC, OGG, AAC**.
- Mechanizm **Drag & Drop** (przeciągnij i upuść na ekran).
- Automatyczne parsowanie metadanych (tytuł, wykonawca, długość) i odtwarzanie bezpośrednio z komputera bez konieczności wysyłania na serwer.

### 🎤 6. Pełnoekranowy Tekst & Wizualizer (Lyrics Modal)
- Dynamiczny tekst zsynchronizowany z postępem odtwarzania utworu.
- Animowany analizator pasma dźwiękowego (equalizer sound wave).
- Efektowne rozmyte tła i sterowanie odtwarzaniem.

---

## 🛠️ Technologie

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Język**: [TypeScript](https://www.typescriptlang.org/)
- **Stylowanie**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikony**: [Lucide React](https://lucide.dev/)
- **Dźwięk**: HTML5 Audio + Web Audio API (Generative Synthesizer & Analyser)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Uruchomienie Projektu

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/ant0uni/spotify.git
   cd spotify
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```

4. Zbuduj wersję produkcyjną:
   ```bash
   npm run build
   ```
