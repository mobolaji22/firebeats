import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  List,
  Monitor,
  Volume2,
  Volume1,
  VolumeX,
  Music,
  Maximize2,
} from "lucide-react";
import NowPlayingScreen from "./NowPlayingScreen";

const Player = ({ currentSong, isPlaying, setIsPlaying, liked, setLiked }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.durationSeconds) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong]);

  // Reset current time when song changes
  useEffect(() => {
    setCurrentTime(0);
  }, [currentSong]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = Math.floor(percent * currentSong.durationSeconds);

    setCurrentTime(newTime);
  };

  const handleVolumeClick = (e) => {
    if (!volumeRef.current) return;

    const rect = volumeRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.floor(percent * 100);

    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 50) return <Volume1 />;
    return <Volume2 />;
  };

  return (
    <>
      <div className="h-24 bg-gray-900 border-t border-gray-800 px-4 flex items-center justify-between">
        {/* Now Playing */}
        <div className="w-1/3 flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowNowPlaying(true)}>
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-amber-500 rounded flex items-center justify-center flex-shrink-0 mr-3">
              <Music size={20} className="text-white" />
            </div>
            <div className="mr-4">
              <h4 className="font-medium text-sm">{currentSong.title}</h4>
              <p className="text-xs text-gray-400">{currentSong.artist}</p>
            </div>
            <button
              className={`text-lg ${
                liked ? "text-red-500" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setLiked(!liked)}>
              <Heart fill={liked ? "currentColor" : "none"} size={18} />
            </button>
          </div>
      </div>

      {/* Player Controls */}
      <div className="w-1/3 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <button
            className={`mx-2 text-gray-400 hover:text-white ${
              isShuffleActive ? "text-red-500" : ""
            }`}
            onClick={() => setIsShuffleActive(!isShuffleActive)}>
            <Shuffle size={18} />
          </button>
          <button className="mx-2 text-gray-400 hover:text-white">
            <SkipBack size={18} />
          </button>
          <button
            className="mx-3 w-8 h-8 bg-white hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center text-black transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} className="ml-0.5" />
            )}
          </button>
          <button className="mx-2 text-gray-400 hover:text-white">
            <SkipForward size={18} />
          </button>
          <button
            className={`mx-2 text-gray-400 hover:text-white ${
              isRepeatActive ? "text-red-500" : ""
            }`}
            onClick={() => setIsRepeatActive(!isRepeatActive)}>
            <Repeat size={18} />
          </button>
        </div>

        <div className="w-full flex items-center">
          <span className="text-xs text-gray-400 w-10">
            {formatTime(currentTime)}
          </span>
          <div
            className="flex-grow h-1 bg-gray-700 rounded-full mx-2 cursor-pointer relative"
            ref={progressRef}
            onClick={handleProgressClick}>
            <div
              className="absolute h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
              style={{
                width: `${(currentTime / currentSong.durationSeconds) * 100}%`,
              }}>
              <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100"></div>
            </div>
          </div>
          <span className="text-xs text-gray-400 w-10">
            {currentSong.duration}
          </span>
        </div>
      </div>

      {/* Additional Controls */}
      <div className="w-1/3 flex justify-end items-center">
        <button className="mx-2 text-gray-400 hover:text-white">
          <List size={18} />
        </button>
        <button
          className="mx-2 text-gray-400 hover:text-white"
          onClick={() => setShowNowPlaying(true)}>
          <Maximize2 size={18} />
        </button>
        <button className="mx-2 text-gray-400 hover:text-white">
          <Monitor size={18} />
        </button>
        <div className="flex items-center ml-4">
          <button
            className="text-gray-400 hover:text-white"
            onClick={toggleMute}>
            <VolumeIcon />
          </button>
          <div
            className="w-24 h-1 bg-gray-700 rounded-full ml-2 cursor-pointer relative"
            ref={volumeRef}
            onClick={handleVolumeClick}>
            <div
              className="absolute h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
              style={{ width: `${isMuted ? 0 : volume}%` }}>
              <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Now Playing Screen */}
      {showNowPlaying && (
        <NowPlayingScreen
          currentSong={currentSong}
          isPlaying={isPlaying}
          liked={liked}
          setLiked={setLiked}
          onClose={() => setShowNowPlaying(false)}
        />
      )}
    </>
  );
};

export default Player;
