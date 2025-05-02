import React from "react";
import { X, Music } from "lucide-react";

const QueueModal = ({ show, onClose, queue = [], currentSong }) => {
  if (!show) {
    return null;
  }

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-end"
      onClick={onClose} // Close when clicking overlay
    >
      {/* Modal Content */}
      <div
        className="bg-gray-900 w-full max-w-md h-full flex flex-col shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold">Queue</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>

        {/* Queue List (Scrollable) */}
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-3">
          {/* Currently Playing */}
          {currentSong && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Now Playing
              </h3>
              <div className="flex items-center p-2 rounded bg-gray-800/50">
                {currentSong.cover && currentSong.cover !== "music" ? (
                  <img
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className="w-10 h-10 rounded object-cover mr-3 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-amber-500 rounded flex items-center justify-center flex-shrink-0 mr-3">
                    <Music size={16} className="text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-red-400 truncate">
                    {currentSong.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {currentSong.artist}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Up */}
          {queue.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mt-4 mb-2">
                Next Up
              </h3>
              {queue.map((song, index) => (
                <div
                  key={song.id || index} // Use song.id if available, otherwise index
                  className="flex items-center p-2 rounded hover:bg-gray-800/50 group"
                >
                  {/* Placeholder for cover art if available */}
                  <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0 mr-3">
                    <Music size={16} className="text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="text-sm font-medium text-white truncate">
                      {song.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                  {/* Optional: Add buttons like remove from queue on hover */}
                  {/* <button className="ml-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100">
                    <X size={16} />
                  </button> */}
                </div>
              ))}
            </div>
          )}

          {queue.length === 0 && !currentSong && (
             <p className="text-gray-500 text-center mt-8">Queue is empty.</p>
          )}
           {queue.length === 0 && currentSong && (
             <p className="text-gray-500 text-center mt-8">No songs up next.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueModal;