import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Music,
  Share2,
  ChevronDown,
  ListMusic,
  Mic2,
  Volume2,
  Volume1, // Added Volume1
  VolumeX, // Added VolumeX
  Shuffle,
  SkipBack,
  Play,
  Pause, // Added Pause
  SkipForward,
  Repeat,
  Clock,
  Calendar,
  Album,
  User,
  List, // Added List
  Monitor, // Added Monitor
  Maximize2, // Added Maximize2
} from "lucide-react";

// Add necessary props for player state and controls
const NowPlayingScreen = ({
  currentSong,
  isPlaying,
  setIsPlaying, // Added
  liked,
  setLiked,
  onClose,
  currentTime, // Added
  durationSeconds, // Added (or use currentSong.durationSeconds)
  volume, // Added
  isMuted, // Added
  isShuffleActive, // Added
  isRepeatActive, // Added
  handleProgressClick, // Added
  handleVolumeClick, // Added
  toggleMute, // Added
  toggleShuffle, // Added
  toggleRepeat, // Added
  handleSkipBack, // Added
  handleSkipForward, // Added
  // Add any other needed controls/state like volumeRef etc.
}) => {
  const [activeTab, setActiveTab] = useState("lyrics");
  const [scrolled, setScrolled] = useState(false); // Added state for scroll effect

  // Refs for progress and volume bars (needed if handle...Click use them)
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  // Handle scroll effect
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setScrolled(scrollTop > 50);
  };

  // Helper function (can be moved to a utils file)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Volume Icon Logic (can be moved to utils or kept here)
  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />; // Consistent size
    if (volume < 50) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
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
    <div className="fixed inset-0 bg-gradient-to-b from-red-600/50 via-gray-950 to-black backdrop-blur-lg z-50 text-white flex flex-col">
      {/* Header - Fixed */}
      <div
        className={`sticky top-0 z-10 p-6 flex items-center justify-between ${
          scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
        } transition-all duration-300`}>
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
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 px-6 py-8 lg:py-16">
          {/* Album Art (Left Side on Large Screens) */}
          <div className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-red-500 to-amber-500 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            {/* Use actual cover art if available */}
            {currentSong.cover && currentSong.cover !== "music" ? (
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <Music size={80} className="text-white/80" />
            )}
          </div>

          {/* Song Info & Tabs (Right Side on Large Screens) */}
          <div className="w-full max-w-2xl lg:max-w-none lg:flex-1 flex flex-col items-center lg:items-start space-y-8">
            {/* Song Details */}
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                {currentSong.title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-400">
                {currentSong.artist}
              </p>
              <p className="text-sm text-gray-500">{currentSong.album}</p>
            </div>

            {/* Tabs - Lyrics, Queue, Credits */}
            <div className="w-full">
              <div className="flex justify-center lg:justify-start border-b border-gray-700 mb-6">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "lyrics"
                      ? "text-white border-b-2 border-red-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("lyrics")}>
                  Lyrics
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "queue"
                      ? "text-white border-b-2 border-red-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("queue")}>
                  Queue
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "credits"
                      ? "text-white border-b-2 border-red-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("credits")}>
                  Credits
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {" "}
                {/* Ensure minimum height */}
                {activeTab === "lyrics" && (
                  <div className="space-y-4 text-center lg:text-left">
                    {lyrics.map((line, index) => (
                      <p key={index} className="text-lg text-gray-300">
                        {line.text}
                      </p>
                    ))}
                  </div>
                )}
                {activeTab === "queue" && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold mb-3">Next Up</h3>
                    {queue.slice(1).map(
                      (
                        song // Skip the current song
                      ) => (
                        <div
                          key={song.id}
                          className="flex items-center justify-between p-2 rounded hover:bg-white/5">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center mr-3">
                              <Music size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {song.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {song.artist}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {song.duration}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
                {activeTab === "credits" && (
                  <div className="space-y-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <User size={16} /> Performed by: {currentSong.artist}
                    </div>
                    <div className="flex items-center gap-2">
                      <Album size={16} /> Album: {currentSong.album}
                    </div>
                    {/* Add more credits if available */}
                    <div className="flex items-center gap-2">
                      <Calendar size={16} /> Released: N/A
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Add padding-bottom to prevent content from being hidden by fixed controls */}
        <div className="pb-32"></div>
      </div>

      {/* Fixed Player Controls Overlay */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md z-20">
        <div className="mx-auto px-4 py-4">
          {/* Progress Bar */}
          <div className="w-full flex items-center mb-3">
            <span className="text-xs text-gray-400 w-10 text-right mr-2">
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-grow h-1.5 bg-gray-700 rounded-full cursor-pointer relative group" // Increased height slightly
              ref={progressRef}
              onClick={handleProgressClick}>
              <div
                className="absolute h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                style={{
                  width: `${
                    (currentTime / (currentSong.durationSeconds || 1)) * 100
                  }%`, // Added fallback for duration
                }}>
                {/* Knob visible on hover/touch */}
                <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-xs text-gray-400 w-10 text-left ml-2">
              {currentSong.duration || "0:00"} {/* Added fallback */}
            </span>
          </div>
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            {/* Left side: Like button */}
            <div className="w-1/4 flex justify-start">
              <button
                className={`text-lg p-2 rounded-full hover:bg-white/10 ${
                  liked ? "text-red-500" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setLiked(!liked)}>
                <Heart fill={liked ? "currentColor" : "none"} size={20} />
              </button>
            </div>

            {/* Center: Main Playback Controls */}
            <div className="w-1/2 flex items-center justify-center">
              <button
                className={`mx-2 p-2 rounded-full hover:bg-white/10 ${
                  isShuffleActive
                    ? "text-red-500"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={toggleShuffle}>
                {" "}
                {/* Use prop handler */}
                <Shuffle size={18} />
              </button>
              <button
                className="mx-2 text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10"
                onClick={handleSkipBack}>
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button
                className="mx-3 w-10 h-10 bg-white hover:scale-105 rounded-full flex items-center justify-center text-black transition-transform"
                onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? (
                  <Pause size={22} fill="currentColor" />
                ) : (
                  <Play size={22} fill="currentColor" className="ml-0.5" />
                )}
              </button>
              <button
                className="mx-2 text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10"
                onClick={handleSkipForward}>
                <SkipForward size={20} fill="currentColor" />
              </button>
              <button
                className={`mx-2 p-2 rounded-full hover:bg-white/10 ${
                  isRepeatActive
                    ? "text-red-500"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={toggleRepeat}>
                <Repeat size={18} />
              </button>
            </div>

            {/* Right side: Volume and Other Controls */}
            <div className="w-1/4 flex justify-end items-center">
              <button className="mx-1 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10">
                <Mic2 size={18} /> {/* Lyrics Button? */}
              </button>
              <button
                className="mx-1 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
                onClick={() => setActiveTab("queue")}>
                <ListMusic size={18} /> {/* Queue Button? */}
              </button>
              <div className="flex items-center group">
                <button
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
                  onClick={toggleMute}>
                  <VolumeIcon /> {/* Use VolumeIcon component */}
                </button>
                <div className="w-0 group-hover:w-24 transition-all duration-300 overflow-hidden flex items-center">
                  <div
                    className="flex-grow h-1.5 bg-gray-700 rounded-full ml-1 cursor-pointer relative"
                    ref={volumeRef}
                    onClick={handleVolumeClick}>
                    <div
                      className="absolute h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                      style={{ width: `${isMuted ? 0 : volume}%` }}>
                      <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingScreen;
