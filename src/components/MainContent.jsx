import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Music,
  Heart,
  Guitar,
  Headphones,
  Disc,
  Mic,
  Play,
  Clock, // Import Clock icon
  ChevronDown, // Import ChevronDown if not already (it was missing in the provided snippet)
} from "lucide-react";

import { searchMulti, getRecommendations } from '../services/spotifyApi';

// Helper function to format duration from ms to M:SS
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const MainContent = ({ onPlaySong, currentSongId }) => {
  const [greeting, setGreeting] = useState("Good afternoon");
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true); // Renamed for clarity
  const [hoveredSongId, setHoveredSongId] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Mock playlists - we'll replace this later
  const playlists = [
    { id: "liked", icon: Heart, name: "Liked Songs", count: "124 songs" },
    { id: "summer", icon: Music, name: "Summer Vibes", count: "47 songs" },
    { id: "rock", icon: Guitar, name: "Rock Classics", count: "86 songs" },
    { id: "chill", icon: Headphones, name: "Chill Beats", count: "32 songs" },
    { id: "90s", icon: Disc, name: "90s Hits", count: "65 songs" },
    {
      id: "podcast",
      icon: Mic,
      name: "Podcast Favorites",
      count: "12 episodes",
    },
  ];

  // Remove mock recentSongs array
  // const recentSongs = [ ... ];

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setIsLoadingTracks(true); // Use the renamed state setter
        const recommendations = await getRecommendations({
          limit: 10, // Fetch more tracks for the table
          seedTracks: '0c6xIDDpzE81m2q797ordA', // Example seed track
          seedArtists: '4NHQUGzhtTLFvgF5SZesLK', // Example seed artist
          seedGenres: 'pop,rock,electronic' // Example seed genres
        });

        // Ensure recommendations.tracks is an array before setting state
        if (recommendations && Array.isArray(recommendations.tracks)) {
          setFeaturedTracks(recommendations.tracks);
        } else {
          console.error('API did not return tracks array:', recommendations);
          setFeaturedTracks([]); // Set to empty array on error or unexpected format
        }
      } catch (error) {
        console.error('Error fetching featured content:', error);
        setFeaturedTracks([]); // Set to empty array on fetch error
      } finally {
        setIsLoadingTracks(false); // Use the renamed state setter
      }
    };

    fetchFeaturedContent();
  }, []);

  // Prepare song data for the player
  const prepareSongData = (track) => {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
      album: track.album?.name || 'Unknown Album',
      duration: formatDuration(track.duration_ms),
      durationSeconds: Math.floor(track.duration_ms / 1000),
      cover: track.album?.images?.[0]?.url || 'music', // Use album art or fallback
      // Add the raw track object if needed by the player or other components
      apiTrack: track
    };
  };


  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-gradient-to-b from-red-500/20 via-black to-black">
      {/* Header */}
      <header className="px-8 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:text-white">
            <ChevronLeft size={18} />
          </button>
          <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:text-white">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center bg-black/60 rounded-full px-1 py-1 cursor-pointer hover:bg-black/40">
          <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center mr-2">
            <span className="font-medium text-sm">U</span>
          </div>
          <span className="font-medium mr-2">User</span>
          <ChevronDown size={16} />
        </div>
      </header>

      {/* Content area */}
      <div className="flex-grow overflow-y-auto px-8 py-6 custom-scrollbar">
        {/* Welcome section (using mock playlists for now) */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6">{greeting}</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="group bg-gray-900/70 hover:bg-gray-800 p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-xl relative overflow-hidden">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-amber-500 rounded flex items-center justify-center flex-shrink-0">
                    <playlist.icon size={24} className="text-white" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="font-semibold truncate">{playlist.name}</h4>
                    <p className="text-sm text-gray-400 truncate">
                      {playlist.count}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 bottom-4">
                    <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                      <Play
                        size={16}
                        fill="white"
                        className="text-white ml-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Tracks section (replaces Recently played) */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            {/* Changed title */}
            <h3 className="text-2xl font-bold">Featured Tracks</h3>
            {/* Link might not be relevant anymore or could link elsewhere */}
            {/* <a href="#" className="text-sm text-gray-400 font-semibold hover:underline">See all</a> */}
          </div>

          {isLoadingTracks ? (
             <p>Loading tracks...</p> // Add a loading indicator
          ) : featuredTracks.length === 0 ? (
             <p>No featured tracks available.</p> // Handle empty state
          ) : (
            <div className="bg-gray-900/40 rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-gray-400">
                    <th className="py-3 px-4 font-normal text-sm w-12">#</th>
                    <th className="py-3 px-4 font-normal text-sm">Title</th>
                    <th className="py-3 px-4 font-normal text-sm hidden md:table-cell">
                      Album
                    </th>
                    {/* Removed Date Added column */}
                    {/* <th className="py-3 px-4 font-normal text-sm hidden lg:table-cell">Date added</th> */}
                    <th className="py-3 px-4 font-normal text-sm text-right">
                      <Clock size={16} className="inline-block" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map over featuredTracks instead of recentSongs */}
                  {featuredTracks.map((track, index) => (
                    <tr
                      key={track.id}
                      className="group hover:bg-gray-800/60 transition-colors"
                      onMouseEnter={() => setHoveredSongId(track.id)}
                      onMouseLeave={() => setHoveredSongId(null)}
                      onClick={() => onPlaySong(prepareSongData(track))} // Use prepared data
                      >
                      <td className="py-3 px-4 text-gray-400">
                        {/* Show play button on hover or if it's the current song */}
                        {hoveredSongId === track.id || currentSongId === track.id ? (
                          <Play
                            size={16}
                            fill="white"
                            className={`text-white ${currentSongId === track.id ? 'text-red-500' : ''}`}
                          />
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td className="py-3 px-4 flex items-center">
                        {/* Use actual album art if available */}
                        {track.album?.images?.[0]?.url ? (
                           <img src={track.album.images[0].url} alt={track.album.name} className="w-10 h-10 rounded mr-4 object-cover"/>
                        ) : (
                           <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-amber-500 rounded flex items-center justify-center flex-shrink-0 mr-4">
                             <Music size={18} className="text-white" />
                           </div>
                        )}

                        <div>
                          <h4 className={`font-medium ${currentSongId === track.id ? 'text-red-500' : ''}`}>
                            {track.name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {/* Join multiple artists */}
                            {track.artists?.map(a => a.name).join(', ')}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400 hidden md:table-cell">
                        {track.album?.name || 'Single'} {/* Show album name */}
                      </td>
                      {/* Removed Date Added cell */}
                      {/* <td className="py-3 px-4 text-sm text-gray-400 hidden lg:table-cell">{song.date}</td> */}
                      <td className="py-3 px-4 text-sm text-gray-400 text-right">
                        {/* Format duration from ms */}
                        {formatDuration(track.duration_ms)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Other sections (e.g., Made for you, Charts) can be added here later */}
      </div>
    </div>
  );
};

export default MainContent;
