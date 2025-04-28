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
} from "lucide-react";

import { searchMulti, getRecommendations } from '../services/spotifyApi';

const MainContent = ({ onPlaySong, currentSongId }) => {
  const [greeting, setGreeting] = useState("Good afternoon");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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

  const recentSongs = [
    {
      id: 1,
      title: "Ignite The Night",
      artist: "Fire Starters",
      album: "Burn It Up",
      date: "2 days ago",
      duration: "3:45",
      durationSeconds: 225,
      cover: "music",
    },
    {
      id: 2,
      title: "Sunrise Groove",
      artist: "Morning Flames",
      album: "Dawn Breaks",
      date: "3 days ago",
      duration: "4:12",
      durationSeconds: 252,
      cover: "music",
    },
    {
      id: 3,
      title: "Amber Waves",
      artist: "Desert Heat",
      album: "Scorched Earth",
      date: "1 week ago",
      duration: "3:21",
      durationSeconds: 201,
      cover: "music",
    },
    {
      id: 4,
      title: "Inferno Beat",
      artist: "Flame Throwers",
      album: "Hot Takes",
      date: "2 weeks ago",
      duration: "2:58",
      durationSeconds: 178,
      cover: "music",
    },
    {
      id: 5,
      title: "Phoenix Rising",
      artist: "Rebirth Cycle",
      album: "From Ashes",
      date: "2 weeks ago",
      duration: "5:32",
      durationSeconds: 332,
      cover: "music",
    },
  ];

  const [hoveredSongId, setHoveredSongId] = useState(null);

  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setIsLoading(true);
        // Get some initial recommendations
        const recommendations = await getRecommendations({
          limit: 5,
          seedTracks: '0c6xIDDpzE81m2q797ordA',
          seedArtists: '4NHQUGzhtTLFvgF5SZesLK',
          seedGenres: 'pop,rock'
        });
        
        setFeaturedTracks(recommendations.tracks);
      } catch (error) {
        console.error('Error fetching featured content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

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
        {/* Welcome section */}
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

        {/* Recently played section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Recently played</h3>
            <a
              href="#"
              className="text-sm text-gray-400 font-semibold hover:underline">
              See all
            </a>
          </div>

          <div className="bg-gray-900/40 rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-left text-gray-400">
                  <th className="py-3 px-4 font-normal text-sm w-12">#</th>
                  <th className="py-3 px-4 font-normal text-sm">Title</th>
                  <th className="py-3 px-4 font-normal text-sm hidden md:table-cell">
                    Album
                  </th>
                  <th className="py-3 px-4 font-normal text-sm hidden lg:table-cell">
                    Date added
                  </th>
                  <th className="py-3 px-4 font-normal text-sm text-right">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSongs.map((song, index) => (
                  <tr
                    key={song.id}
                    className={`border-b border-gray-800/50 hover:bg-white/5 ${
                      currentSongId === song.id ? "bg-white/10" : ""
                    }`}
                    onMouseEnter={() => setHoveredSongId(song.id)}
                    onMouseLeave={() => setHoveredSongId(null)}
                    onClick={() => onPlaySong(song)}>
                    <td className="py-3 px-4 text-gray-400">
                      {hoveredSongId === song.id ? (
                        <Play size={16} className="text-white" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-amber-500 rounded flex items-center justify-center flex-shrink-0 mr-3">
                          <Music size={16} className="text-white" />
                        </div>
                        <div>
                          <h4
                            className={`font-medium ${
                              currentSongId === song.id ? "text-red-500" : ""
                            }`}>
                            {song.title}
                          </h4>
                          <p className="text-sm text-gray-400">{song.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {song.album}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-gray-400 text-sm">
                      {song.date}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-right text-sm">
                      {song.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component
const ChevronDown = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default MainContent;
