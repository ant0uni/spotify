import { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { PlayerBar } from './components/Player/PlayerBar';
import { HomeView } from './components/Views/HomeView';
import { SearchView } from './components/Views/SearchView';
import { PlaylistView } from './components/Views/PlaylistView';
import { LikedSongsView } from './components/Views/LikedSongsView';
import { UploadedSongsView } from './components/Views/UploadedSongsView';
import { StatsView } from './components/Views/StatsView';
import { QueueDrawer } from './components/Views/QueueDrawer';
import { LyricsModal } from './components/Views/LyricsModal';
import type { CurrentView } from './types/music';

function SpotifyApp() {
  const [currentView, setCurrentView] = useState<CurrentView>({ type: 'home' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);

  const renderCurrentView = () => {
    switch (currentView.type) {
      case 'home':
        return <HomeView setCurrentView={setCurrentView} />;
      case 'search':
        return (
          <SearchView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCurrentView={setCurrentView}
          />
        );
      case 'playlist':
        return <PlaylistView playlistId={currentView.playlistId} />;
      case 'liked':
        return <LikedSongsView />;
      case 'uploaded':
        return <UploadedSongsView />;
      case 'stats':
        return <StatsView />;
      default:
        return <HomeView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white font-sans overflow-hidden">
      {/* Main Workspace Layout (Sidebar + Content + Optional Queue) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        {/* Central Content Area */}
        <main className="flex-1 flex flex-col bg-[#121212] rounded-lg overflow-hidden my-2 mr-2 relative">
          <Header
            currentView={currentView}
            setCurrentView={setCurrentView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="flex-1 overflow-y-auto">
            {renderCurrentView()}
          </div>
        </main>

        {/* Right Queue Drawer */}
        <QueueDrawer
          isOpen={isQueueOpen}
          onClose={() => setIsQueueOpen(false)}
        />
      </div>

      {/* Bottom Sticky Player Bar */}
      <PlayerBar
        isQueueOpen={isQueueOpen}
        setIsQueueOpen={setIsQueueOpen}
      />

      {/* Fullscreen Lyrics / Visualizer Modal */}
      <LyricsModal />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <SpotifyApp />
    </PlayerProvider>
  );
}
