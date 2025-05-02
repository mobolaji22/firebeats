import { useState } from "react";
// Import Routes and Route
import { useNavigate, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Player from "./components/Player";
import LibraryPage from "./components/LibraryPage";
import PlaylistView from "./components/PlaylistView";
import AlbumView from "./components/AlbumView";
import ArtistView from "./components/ArtistView";
import SearchPage from "./components/SearchPage";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

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
  // Remove activeView state - the router will handle this
  // const [activeView, setActiveView] = useState("home");

  const handlePlaySong = (song) => {
    // Ensure song data is valid before setting state
    if (song && song.id) {
      setCurrentSong(song);
      setIsPlaying(true);
      setLiked(false); // Reset like status
    } else {
      console.error("Invalid song data passed to handlePlaySong:", song);
      // Optionally show an error to the user
    }
  };

  // Remove renderMainContent function

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <div className="flex flex-grow overflow-hidden">
        {/* Pass navigate to Sidebar if needed, or modify Sidebar to use Link */}
        <Sidebar />

        <div className="flex-grow flex flex-col overflow-hidden">
          <header className="px-8 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                // Add disabled logic based on history if needed
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => navigate(1)}
                className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                // Add disabled logic based on history if needed
              >
                <ChevronRight size={18} />
              </button>
            </div>
            {/* User profile dropdown */}
            <div className="flex items-center bg-black/60 rounded-full px-1 py-1 cursor-pointer hover:bg-black/40">
              <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center mr-2">
                {/* Placeholder User Initial */}
                <span className="font-medium text-sm">U</span>
              </div>
              <span className="font-medium mr-2">User</span>{" "}
              {/* Replace with dynamic user name if available */}
              <ChevronDown size={16} />
            </div>
          </header>

          {/* Main content area using Routes */}
          <div className="flex-grow overflow-hidden bg-gradient-to-b from-red-500/20 via-black to-black">
            {/* Use Routes to render content based on URL */}
            <Routes>
              <Route
                path="/"
                element={
                  <MainContent
                    onPlaySong={handlePlaySong}
                    currentSongId={currentSong?.id} // Use optional chaining
                    // Remove setActiveView prop
                  />
                }
              />
              {/* Update the route for Search */}
              <Route
                path="/search"
                element={<SearchPage onPlaySong={handlePlaySong} />}
              />
              <Route path="/library" element={<LibraryPage />} />
              <Route
                path="/playlist/:playlistId"
                element={<PlaylistView onPlaySong={handlePlaySong} />}
              />
              <Route
                path="/album/:albumId"
                element={<AlbumView onPlaySong={handlePlaySong} />}
              />
              <Route
                path="/artist/:artistId"
                element={<ArtistView onPlaySong={handlePlaySong} />}
              />
              {/* Optional: Add a catch-all route for 404 or redirect */}
              <Route path="*" element={<div>Not Found</div>} />{" "}
              {/* Or redirect to "/" */}
            </Routes>
          </div>
        </div>
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
