import React, { useState, useEffect } from "react";
import { Search, X, Play, Music, User, Disc } from "lucide-react";
import { searchMulti } from "../services/spotifyApi"; // Assuming your API service is here

// Helper function to format duration (if needed, or import from utils)
const formatDuration = (ms) => {
  if (!ms) return "N/A";
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const SearchPage = ({ onPlaySong }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search input
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(null); // Clear results if search is empty
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await searchMulti(searchTerm);
        console.log("Search Results:", results); // Log API response
        setSearchResults(results);
      } catch (err) {
        console.error("Search API error:", err);
        setError("Failed to fetch search results. Please try again.");
        setSearchResults(null); // Clear results on error
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults(null);
    setError(null);
  };

  // Prepare song data for the player (similar to MainContent)
  const prepareSongData = (track) => {
    if (!track) return null;
    return {
      id: track.data?.id,
      title: track.data?.name || "Unknown Title",
      artist:
        track.data?.artists?.items
          ?.map((artist) => artist.profile.name)
          .join(", ") || "Unknown Artist",
      album: track.data?.albumOfTrack?.name || "Unknown Album",
      duration: formatDuration(track.data?.duration?.totalMilliseconds),
      durationSeconds: track.data?.duration?.totalMilliseconds
        ? Math.floor(track.data.duration.totalMilliseconds / 1000)
        : 0,
      cover: track.data?.albumOfTrack?.coverArt?.sources?.[0]?.url || "music",
      apiTrack: track, // Include the raw track data if needed
    };
  };

  const renderResults = () => {
    if (isLoading) {
      return <div className="text-center text-gray-400 mt-8">Searching...</div>;
    }
    if (error) {
      return <div className="text-center text-red-500 mt-8">{error}</div>;
    }
    if (!searchResults || (!searchResults.tracks?.items?.length && !searchResults.artists?.items?.length && !searchResults.albums?.items?.length)) {
      // Only show 'no results' if search term exists and loading is finished
      return searchTerm.trim() ? <div className="text-center text-gray-400 mt-8">No results found for "{searchTerm}".</div> : null;
    }

    return (
      <div className="space-y-8 mt-6">
        {/* Tracks */}
        {searchResults.tracks?.items?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Tracks</h3>
            <div className="space-y-2">
              {searchResults.tracks.items.map((item) => {
                const songData = prepareSongData(item);
                if (!songData) return null; // Skip if data prep fails
                return (
                  <div
                    key={songData.id}
                    className="flex items-center p-2 rounded hover:bg-white/10 group cursor-pointer"
                    onClick={() => onPlaySong(songData)}
                  >
                    {songData.cover && songData.cover !== "music" ? (
                      <img src={songData.cover} alt={songData.title} className="w-10 h-10 rounded object-cover mr-3 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0 mr-3">
                        <Music size={16} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-white truncate">{songData.title}</p>
                      <p className="text-xs text-gray-400 truncate">{songData.artist}</p>
                    </div>
                    <span className="text-xs text-gray-400 ml-4">{songData.duration}</span>
                    <button className="ml-4 p-1 opacity-0 group-hover:opacity-100 text-white bg-red-500 rounded-full hover:bg-red-600">
                      <Play size={16} fill="currentColor" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Artists */}
        {searchResults.artists?.items?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Artists</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.artists.items.map((item) => (
                <div key={item.data?.uri} className="bg-white/5 p-3 rounded hover:bg-white/10 cursor-pointer text-center">
                  {item.data?.visuals?.avatarImage?.sources?.[0]?.url ? (
                     <img src={item.data.visuals.avatarImage.sources[0].url} alt={item.data.profile?.name} className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                       <User size={40} className="text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm font-medium truncate">{item.data?.profile?.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

         {/* Albums */}
         {searchResults.albums?.items?.length > 0 && (
            <div>
                <h3 className="text-xl font-semibold mb-4">Albums</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {searchResults.albums.items.map((item) => (
                        <div key={item.data?.uri} className="bg-white/5 p-3 rounded hover:bg-white/10 cursor-pointer">
                            {item.data?.coverArt?.sources?.[0]?.url ? (
                                <img src={item.data.coverArt.sources[0].url} alt={item.data.name} className="w-full h-auto rounded mb-2 object-cover aspect-square" />
                            ) : (
                                <div className="w-full h-auto bg-gray-700 rounded mb-2 flex items-center justify-center aspect-square">
                                    <Disc size={40} className="text-gray-400" />
                                </div>
                            )}
                            <p className="text-sm font-medium truncate">{item.data?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{item.data?.artists?.items?.[0]?.profile?.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Add sections for Playlists, Podcasts etc. if the API returns them */}

      </div>
    );
  };


  return (
    <div className="flex-grow overflow-y-auto px-8 py-6 custom-scrollbar">
      {/* Search Input */}
      <div className="relative mb-6 max-w-lg mx-auto">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-transparent focus:border-red-500 focus:ring-0 rounded-full py-2 pl-10 pr-10 text-white placeholder-gray-500"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Results Area */}
      {renderResults()}

    </div>
  );
};

export default SearchPage;