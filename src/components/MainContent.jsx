import { useState, useEffect } from "react";
// Import Link
import { Link } from "react-router-dom";
import {
  Music,
  Heart,
  Guitar,
  Headphones,
  Disc,
  Mic,
  Play,
  Clock,
} from "lucide-react";

// Import getPlaylistTracks
import {
  searchMulti,
  getRecommendations,
  getPlaylistTracks,
} from "../services/spotifyApi";

// Helper function to format duration from ms to M:SS
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const MainContent = ({ onPlaySong, currentSongId, setActiveView }) => {
  // Ensure setActiveView is received
  const [greeting, setGreeting] = useState("Good afternoon");
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  const [hoveredSongId, setHoveredSongId] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Mock playlists - we'll replace this later
  const playlists = [
    {
      id: "liked",
      icon: Heart,
      name: "Liked Songs",
      count: "124 songs",
      type: "playlist",
    }, // Example type
    {
      id: "summer",
      icon: Music,
      name: "Summer Vibes",
      count: "47 songs",
      type: "playlist",
    },
    {
      id: "rock",
      icon: Guitar,
      name: "Rock Classics",
      count: "86 songs",
      type: "playlist",
    },
    {
      id: "chill",
      icon: Headphones,
      name: "Chill Beats",
      count: "32 songs",
      type: "playlist",
    },
    {
      id: "90s",
      icon: Disc,
      name: "90s Hits",
      count: "65 songs",
      type: "playlist",
    },
    {
      id: "podcast", // This might need a different view type later
      icon: Mic,
      name: "Podcast Favorites",
      count: "12 episodes",
      type: "playlist", // Assuming playlist for now
    },
    // Example using a real Spotify ID from Sidebar for consistency
    {
      id: "37i9dQZF1DXcBWIGoYBM5M",
      icon: Music,
      name: "Today's Top Hits",
      count: "50 songs",
      type: "playlist", // Ensure type is defined if used for routing
    },
  ];

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setIsLoadingTracks(true); // Use the renamed state setter
        const recommendations = await getRecommendations({
          limit: 10, // Fetch more tracks for the table
          seedTracks: "0c6xIDDpzE81m2q797ordA", // Example seed track
          seedArtists: "4NHQUGzhtTLFvgF5SZesLK", // Example seed artist
          seedGenres: "pop,rock,electronic", // Example seed genres
        });

        // Ensure recommendations.tracks is an array before setting state
        if (recommendations && Array.isArray(recommendations.tracks)) {
          setFeaturedTracks(recommendations.tracks);
        } else {
          console.error("API did not return tracks array:", recommendations);
          setFeaturedTracks([]); // Set to empty array on error or unexpected format
        }
      } catch (error) {
        console.error("Error fetching featured content:", error);
        setFeaturedTracks([]); // Set to empty array on fetch error
      } finally {
        setIsLoadingTracks(false); // Use the renamed state setter
      }
    };

    fetchFeaturedContent();
  }, []);

  // Prepare song data for the player
  const prepareSongData = (track) => {
    // Ensure track and its properties exist before accessing them
    if (!track) {
      console.error("prepareSongData received null or undefined track");
      return null; // Or return a default song object
    }
    return {
      id: track.id,
      title: track.name || "Unknown Title",
      artist: track.artists?.map((a) => a.name).join(", ") || "Unknown Artist",
      album: track.album?.name || "Unknown Album",
      duration: formatDuration(track.duration_ms || 0),
      durationSeconds: track.duration_ms
        ? Math.floor(track.duration_ms / 1000)
        : 0,
      cover: track.album?.images?.[0]?.url || "music", // Use album art or fallback
      // Add the raw track object if needed by the player or other components
      apiTrack: track,
    };
  };

  // Function to handle playing a playlist
  const handlePlayPlaylist = async (playlistId) => {
    console.log("Attempting to play playlist:", playlistId);
    // Add a check for special playlist IDs like 'liked' if they need different handling
    if (playlistId === "liked" || playlistId === "podcast") {
      console.warn(
        `Playing playlist type '${playlistId}' is not yet implemented.`
      );
      // Optionally show a user message
      alert(`Playing '${playlistId}' is not supported yet.`);
      return;
    }
    try {
      // Fetch the first page of tracks for the playlist
      const tracksData = await getPlaylistTracks(playlistId, 0, 50); // Fetch up to 50 tracks
      console.log("Fetched tracks data:", tracksData);

      if (tracksData && tracksData.items && tracksData.items.length > 0) {
        // Find the first playable track (sometimes items might be null or lack track data)
        const firstPlayableItem = tracksData.items.find(
          (item) => item && item.track && item.track.id
        );

        if (firstPlayableItem) {
          const firstTrack = firstPlayableItem.track;
          const songData = prepareSongData(firstTrack);
          if (songData) {
            console.log("Playing first track:", songData);
            onPlaySong(songData); // Play the first track
          } else {
            console.error("Failed to prepare song data for the first track.");
          }
        } else {
          console.log("No playable tracks found in the playlist.");
          // Optionally inform the user
          alert(
            "This playlist appears to be empty or contains no playable tracks."
          );
        }
      } else {
        console.log("Playlist is empty or tracks could not be fetched.");
        alert("Could not load tracks for this playlist.");
      }
    } catch (error) {
      console.error("Error fetching or playing playlist tracks:", error);
      // Optionally inform the user
      alert("An error occurred while trying to play the playlist.");
    }
  };

  return (
    // Remove the outer div with bg-gradient-to-b if the gradient should apply to the whole view area in App.jsx
    <div className="flex-grow flex flex-col overflow-hidden">
      <div className="flex-grow overflow-y-auto px-8 py-6 custom-scrollbar pt-4">
        {/* Welcome section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6">{greeting}</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
            {playlists.slice(0, 6).map((playlist) => (
              // Wrap the card content with Link
              <Link
                key={playlist.id}
                // Use playlist type and id for the route
                // Assuming all are playlists for now
                to={`/playlist/${playlist.id}`}
                // Remove onClick handler from the div below
                className="group bg-gray-900/70 hover:bg-gray-800 p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-xl relative overflow-hidden block" // Added block display
              >
                {/* Keep the inner structure */}
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-amber-500 rounded flex items-center justify-center flex-shrink-0">
                    <playlist.icon size={24} className="text-white" />
                  </div>
                  <div className="ml-4 flex-grow min-w-0">
                    <h4 className="font-semibold truncate">{playlist.name}</h4>
                    <p className="text-sm text-gray-400 truncate">
                      {playlist.count}
                    </p>
                  </div>
                  {/* Play button - Updated onClick */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 bottom-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when clicking play
                        e.stopPropagation(); // Stop event bubbling
                        // Call the new handler function
                        handlePlayPlaylist(playlist.id);
                      }}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 cursor-pointer rounded-full flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                      <Play
                        size={16}
                        fill="white"
                        className="text-white ml-1"
                      />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Tracks section (replaces Recently played) */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Featured Tracks</h3>
          {/* Loading State */}
          {isLoadingTracks && (
            <div className="text-center text-gray-400">Loading tracks...</div>
          )}
          {/* Track Table */}
          {!isLoadingTracks && featuredTracks.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="px-4 py-2 font-normal">#</th>
                  <th className="px-4 py-2 font-normal">Title</th>
                  <th className="px-4 py-2 font-normal hidden md:table-cell">
                    Album
                  </th>
                  <th className="px-4 py-2 font-normal text-right">
                    <Clock size={16} className="inline-block" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {featuredTracks.map((track, index) => {
                  const songData = prepareSongData(track); // Prepare data once
                  // Skip rendering if songData couldn't be prepared
                  if (!songData) return null;
                  const isCurrentSong = songData.id === currentSongId;

                  return (
                    <tr
                      key={songData.id}
                      className={`hover:bg-gray-800/50 rounded-lg group ${
                        isCurrentSong ? "bg-gray-700/50 text-red-400" : ""
                      }`}
                      onMouseEnter={() => setHoveredSongId(songData.id)}
                      onMouseLeave={() => setHoveredSongId(null)}
                      onClick={() => onPlaySong(songData)} // Play song on row click
                    >
                      <td className="px-4 py-3 text-gray-400 relative">
                        <span
                          className={`absolute left-0 top-0 bottom-0 flex items-center justify-center w-full h-full transition-opacity duration-200 ${
                            hoveredSongId === songData.id && !isCurrentSong
                              ? "opacity-100"
                              : "opacity-0"
                          }`}>
                          <Play size={16} fill="currentColor" />
                        </span>
                        <span
                          className={`transition-opacity duration-200 ${
                            hoveredSongId === songData.id && !isCurrentSong
                              ? "opacity-0"
                              : "opacity-100"
                          }`}>
                          {isCurrentSong ? (
                            <Music size={16} className="text-red-400" />
                          ) : (
                            index + 1
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex items-center">
                        {/* Use actual cover art */}
                        {songData.cover && songData.cover !== "music" ? (
                          <img
                            src={songData.cover}
                            alt={songData.title}
                            className="w-10 h-10 rounded object-cover mr-3 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded flex items-center justify-center flex-shrink-0 mr-3">
                            <Music size={18} className="text-white/80" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div
                            className={`font-medium truncate ${
                              isCurrentSong ? "text-red-400" : "text-white"
                            }`}>
                            {songData.title}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {songData.artist}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell truncate">
                        {songData.album}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-right">
                        {songData.duration}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {/* Empty State */}
          {!isLoadingTracks && featuredTracks.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No featured tracks found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
