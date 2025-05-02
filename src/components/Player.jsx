import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  List, // Keep List icon
  Monitor,
  Volume2,
  Volume1,
  VolumeX,
  Music,
  Maximize2,
} from "lucide-react";
import NowPlayingScreen from "./NowPlayingScreen"; // Ensure correct import
// Import the QueueModal (we will create this file next)
import QueueModal from "./QueueModal";

const Player = ({ currentSong, isPlaying, setIsPlaying, liked, setLiked }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  // Add state for queue modal visibility
  const [showQueueModal, setShowQueueModal] = useState(false);

  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  // --- Playback Logic ---
  useEffect(() => {
    // Reset time when song changes
    setCurrentTime(0);
  }, [currentSong]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.durationSeconds) {
            // Handle song end (e.g., play next, repeat, stop)
            // For now, just stop and reset
            setIsPlaying(false);
            clearInterval(interval);
            return 0; // Reset time
          }
          return prev + 1;
        });
      }, 1000);
    } else if (!isPlaying && currentTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong.durationSeconds, setIsPlaying, currentTime]); // Added currentTime dependency

  // --- Helper Functions ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // --- Event Handlers ---
  const handleProgressClick = (e) => {
    if (!progressRef.current || !currentSong.durationSeconds) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = Math.max(0, Math.min(1, clickX / width)); // Ensure percent is between 0 and 1

    const newTime = Math.floor(percent * currentSong.durationSeconds);
    setCurrentTime(newTime);

    // If paused, start playing from the new time
    // if (!isPlaying) {
    //   setIsPlaying(true);
    // }
  };

  const handleVolumeClick = (e) => {
    if (!volumeRef.current) return;

    const rect = volumeRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = Math.max(0, Math.min(1, clickX / width)); // Ensure percent is between 0 and 1

    const newVolume = Math.floor(percent * 100);

    setVolume(newVolume);
    setIsMuted(newVolume === 0); // Mute if volume is 0
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    const currentlyMuted = isMuted;
    setIsMuted(!currentlyMuted);
    // If unmuting and volume was 0, set a default volume
    if (currentlyMuted && volume === 0) {
      setVolume(50); // Or restore previous volume if stored
    }
  };

  const toggleShuffle = () => setIsShuffleActive(!isShuffleActive);
  const toggleRepeat = () => setIsRepeatActive(!isRepeatActive);
  // Add handler to toggle queue modal
  const toggleQueueModal = () => setShowQueueModal(!showQueueModal);

  // Placeholder skip functions (implement actual logic later)
  const handleSkipBack = () => {
    console.log("Skip Back clicked");
    setCurrentTime(0); // Simple reset for now
  };
  const handleSkipForward = () => {
    console.log("Skip Forward clicked");
    // Implement logic to play next song
    setCurrentTime(0); // Simple reset for now
    setIsPlaying(false); // Stop current song
  };

  // --- Volume Icon ---
  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 50) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  // Mock queue data (replace with actual queue state later)
  const queue = [
    { id: 2, title: "Sunrise Groove", artist: "Morning Flames" },
    { id: 3, title: "Amber Waves", artist: "Desert Heat" },
    { id: 4, title: "City Lights", artist: "Urban Pulse" },
  ];

  return (
    <>
      {/* Bottom Player Bar */}
      <div
        className={`h-24 bg-gray-950 border-t border-gray-800 px-4 flex items-center justify-between transition-transform duration-300 ${
          showNowPlaying
            ? "-translate-y-full opacity-0 invisible"
            : "translate-y-0 opacity-100 visible"
        }`}>
        {/* Now Playing Info */}
        <div className="w-1/3 flex items-center min-w-0">
          {" "}
          {/* Added min-w-0 */}
          {/* Clickable area to open NowPlayingScreen */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setShowNowPlaying(true)}>
            {/* Use actual cover art */}
            {currentSong.cover && currentSong.cover !== "music" ? (
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-14 h-14 rounded object-cover mr-3 flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-amber-500 rounded flex items-center justify-center flex-shrink-0 mr-3">
                <Music size={20} className="text-white" />
              </div>
            )}
            <div className="mr-4 overflow-hidden">
              {" "}
              {/* Added overflow-hidden */}
              <h4 className="font-medium text-sm truncate">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>
          {/* Like Button */}
          <button
            className={`text-lg ml-2 p-1 rounded-full ${
              liked ? "text-red-500" : "text-gray-400 hover:text-white"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}>
            {" "}
            {/* Prevent opening screen */}
            <Heart fill={liked ? "currentColor" : "none"} size={18} />
          </button>
        </div>

        {/* Player Controls (Center) */}
        <div className="w-1/3 flex flex-col items-center">
          {/* Buttons */}
          <div className="flex items-center mb-2">
            <button
              className={`mx-2 text-gray-400 hover:text-white ${
                isShuffleActive ? "text-red-500" : ""
              }`}
              onClick={toggleShuffle}>
              <Shuffle size={18} />
            </button>
            <button
              className="mx-2 text-gray-400 hover:text-white"
              onClick={handleSkipBack}>
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button
              className="mx-3 w-8 h-8 bg-white hover:scale-105 rounded-full flex items-center justify-center text-black transition-transform"
              onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>
            <button
              className="mx-2 text-gray-400 hover:text-white"
              onClick={handleSkipForward}>
              <SkipForward size={18} fill="currentColor" />
            </button>
            <button
              className={`mx-2 text-gray-400 hover:text-white ${
                isRepeatActive ? "text-red-500" : ""
              }`}
              onClick={toggleRepeat}>
              <Repeat size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center">
            <span className="text-xs text-gray-400 w-10 text-right mr-2">
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-grow h-1 bg-gray-700 rounded-full mx-2 cursor-pointer relative group"
              ref={progressRef}
              onClick={handleProgressClick}>
              <div
                className="absolute h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                style={{
                  width: `${
                    (currentTime / (currentSong.durationSeconds || 1)) * 100
                  }%`, // Added fallback
                }}>
                {/* Knob */}
                <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-xs text-gray-400 w-10 text-left ml-2">
              {currentSong.duration || "0:00"} {/* Added fallback */}
            </span>
          </div>
        </div>

        {/* Additional Controls (Right) */}
        <div className="w-1/3 flex justify-end items-center">
          <button
            className="mx-1 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
            onClick={toggleQueueModal} // Attach the toggle handler
            title="Queue" // Add tooltip
          >
            <List size={18} /> {/* Queue */}
          </button>
          <button className="mx-1 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10">
            <Monitor size={18} /> {/* Devices */}
          </button>
          {/* Volume Control */}
          <div className="flex items-center group mx-1">
            <button
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
              onClick={toggleMute}>
              <VolumeIcon />
            </button>
            <div className="w-0 group-hover:w-20 transition-all duration-300 overflow-hidden flex items-center">
              <div
                className="flex-grow h-1 bg-gray-700 rounded-full ml-1 cursor-pointer relative"
                ref={volumeRef}
                onClick={handleVolumeClick}>
                <div
                  className="absolute h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                  style={{ width: `${isMuted ? 0 : volume}%` }}>
                  {/* Knob */}
                  <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Fullscreen/Now Playing Screen Toggle */}
          <button
            className="ml-1 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
            onClick={() => setShowNowPlaying(true)}>
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Now Playing Screen (Modal) */}
      {showNowPlaying && (
        <NowPlayingScreen
          currentSong={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying} // Pass down
          liked={liked}
          setLiked={setLiked}
          onClose={() => setShowNowPlaying(false)}
          // Pass all player state and handlers
          currentTime={currentTime}
          durationSeconds={currentSong.durationSeconds}
          volume={volume}
          isMuted={isMuted}
          isShuffleActive={isShuffleActive}
          isRepeatActive={isRepeatActive}
          handleProgressClick={handleProgressClick}
          handleVolumeClick={handleVolumeClick}
          toggleMute={toggleMute}
          toggleShuffle={toggleShuffle}
          toggleRepeat={toggleRepeat}
          handleSkipBack={handleSkipBack}
          handleSkipForward={handleSkipForward}
          // Pass refs if needed by handlers, though direct DOM manipulation is less ideal
          // progressRef={progressRef}
          // volumeRef={volumeRef}
        />
      )}

      {/* Conditionally render the Queue Modal */}
      <QueueModal
        show={showQueueModal}
        onClose={toggleQueueModal}
        queue={queue} // Pass the mock queue data
        currentSong={currentSong} // Pass current song to highlight it
      />
    </>
  );
};

export default Player;
