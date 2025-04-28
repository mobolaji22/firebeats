import { useState, useEffect } from "react";
import {
  Heart,
  Music,
  Share2,
  ChevronDown,
  ListMusic,
  Mic2,
  Volume2,
  Shuffle,
  SkipBack,
  Play,
  SkipForward,
  Repeat,
  Clock,
  Calendar,
  Album,
  User,
} from "lucide-react";

const NowPlayingScreen = ({
  currentSong,
  isPlaying,
  liked,
  setLiked,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("lyrics");
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setScrolled(scrollTop > 50);
  };

  // Dummy lyrics data (replace with real lyrics API integration later)
  const lyrics = [
    { time: 0, text: "Verse 1" },
    { time: 15, text: "When the night falls" },
    { time: 30, text: "And the stars align" },
    { time: 45, text: "We'll ignite the fire" },
    { time: 60, text: "That burns so bright" },
  ];

  // Dummy queue data (replace with real queue management later)
  const queue = [
    {
      id: 1,
      title: "Ignite The Night",
      artist: "Fire Starters",
      duration: "3:45",
    },
    {
      id: 2,
      title: "Sunrise Groove",
      artist: "Morning Flames",
      duration: "4:12",
    },
    {
      id: 3,
      title: "Amber Waves",
      artist: "Desert Heat",
      duration: "3:21",
    },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black backdrop-blur-lg z-50 text-white flex flex-col">
      {/* Header - Fixed */}
      <div className="sticky top-0 z-10 p-6 flex items-center justify-between bg-black/80 backdrop-blur-md transition-all duration-300">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronDown size={24} />
        </button>
        <span className="font-medium text-lg">Now Playing</span>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Share2 size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar"
        onScroll={handleScroll}>
        {/* Main Content */}
        <div className="flex flex-col items-center px-6 py-8 space-y-8">
          {/* Album Art */}
          <div className="w-48 h-48 md:w-60 md:h-60 bg-gradient-to-br from-red-500 to-amber-500 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <Music size={50} className="text-white" />
          </div>

          {/* Song Info and Controls */}
          <div className="w-full max-w-2xl space-y-6">
            {/* Song Details */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">{currentSong.title}</h2>
              <p className="text-xl text-gray-400">{currentSong.artist}</p>
              <p className="text-sm text-gray-500">{currentSong.album}</p>
            </div>
          </div>
        </div>

        {/* Fixed Player Controls Overlay */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md transition-all duration-300 ${
            scrolled ? "translate-y-0" : "translate-y-full"
          }`}>
          <div className="max-w-2xl mx-auto p-6 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (currentSong.currentTime / currentSong.durationSeconds) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>0:00</span>
                <span>{currentSong.duration}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-8">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Shuffle size={22} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipBack size={25} />
              </button>
              <button className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <Play size={25} className="ml-1" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipForward size={25} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Repeat size={22} />
              </button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center justify-between">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Volume2 size={20} className="text-gray-400" />
              </button>
              <button
                className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
                  liked ? "text-red-500" : "text-gray-400"
                }`}
                onClick={() => setLiked(!liked)}>
                <Heart fill={liked ? "currentColor" : "none"} size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-white/10">
          <div className="flex">
            <button
              className={`flex-1 py-5 text-sm font-medium transition-colors ${
                activeTab === "lyrics"
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("lyrics")}>
              <div className="flex items-center justify-center space-x-2">
                <Mic2 size={18} />
                <span>Lyrics</span>
              </div>
            </button>
            <button
              className={`flex-1 py-5 text-sm font-medium transition-colors ${
                activeTab === "queue"
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("queue")}>
              <div className="flex items-center justify-center space-x-2">
                <ListMusic size={18} />
                <span>Queue</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="h-64 overflow-y-auto custom-scrollbar p-6">
            {activeTab === "lyrics" ? (
              <div className="space-y-8">
                {lyrics.map((line, index) => (
                  <p
                    key={index}
                    className="text-center text-xl text-gray-400 hover:text-white transition-colors cursor-pointer">
                    {line.text}
                  </p>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-amber-500 rounded-lg flex items-center justify-center mr-4">
                        <Music size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">{song.title}</h4>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {song.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingScreen;
