import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Player from "./components/Player";
// Import other potential view components here later (e.g., Search, Library)
// import SearchPage from './components/SearchPage';
import LibraryPage from "./components/LibraryPage";

function App() {
  const [currentSong, setCurrentSong] = useState({
    id: 1,
    title: "Ignite The Night",
    artist: "Fire Starters",
    album: "Burn It Up",
    duration: "3:45",
    durationSeconds: 225,
    cover: "music",
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeView, setActiveView] = useState("home"); // Add state for active view

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setLiked(false);
  };

  // Function to render the main content based on activeView
  const renderMainContent = () => {
    switch (activeView) {
      case "home":
        return (
          <MainContent
            onPlaySong={handlePlaySong}
            currentSongId={currentSong.id}
          />
        );
      case "search":
        // return <SearchPage />; // Placeholder for Search component
        // For now, let's just show MainContent for search too
        return (
          <MainContent
            onPlaySong={handlePlaySong}
            currentSongId={currentSong.id}
          />
        );
      case "library":
        return <LibraryPage />;

      default:
        return (
          <MainContent
            onPlaySong={handlePlaySong}
            currentSongId={currentSong.id}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <div className="flex flex-grow overflow-hidden">
        {/* Pass activeView and setActiveView to Sidebar */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        {renderMainContent()} {/* Render content based on state */}
      </div>
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        liked={liked}
        setLiked={setLiked}
      />
    </div>
  );
}

export default App;
