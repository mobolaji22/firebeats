import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Music,
  Guitar,
  Headphones,
  Disc,
} from "lucide-react";

// Remove activeView and setActiveView props
const Sidebar = () => {
  // Get the current location
  const location = useLocation();

  const menuItems = [
    // Add 'to' prop for routing
    { id: "home", icon: Home, label: "Home", to: "/" },
    { id: "search", icon: Search, label: "Search", to: "/search" },
    { id: "library", icon: Library, label: "Your Library", to: "/library" },
  ];

  const playlists = [
    // Keep playlist data as is for now
    { id: "liked", icon: Heart, name: "Liked Songs", count: "124 songs" },
    { id: "summer", icon: Music, name: "Summer Vibes", count: "47 songs" },
    { id: "rock", icon: Guitar, name: "Rock Classics", count: "86 songs" },
    { id: "chill", icon: Headphones, name: "Chill Beats", count: "32 songs" },
    { id: "90s", icon: Disc, name: "90s Hits", count: "65 songs" },
    {
      id: "37i9dQZF1DXcBWIGoYBM5M",
      icon: Music,
      name: "Today's Top Hits",
      count: "50 songs",
    },
  ];

  // Handler function for adding a playlist (placeholder)
  const handleAddPlaylist = () => {
    console.log("Add Playlist button clicked!");
    // TODO: Implement actual playlist creation logic here
    // This might involve:
    // 1. Showing a modal or input field for the playlist name
    // 2. Calling the Spotify API to create the playlist
    // 3. Updating the local playlists state (if managing locally) or re-fetching
    alert("Playlist creation feature not yet implemented.");
  };

  return (
    <div className="w-72 bg-black flex-shrink-0 flex flex-col border-r border-gray-800 h-full overflow-hidden transition-all duration-300">
      <div className="px-6 py-6 flex flex-col h-full">
        {/* Logo Section - unchanged */}
        <div className="flex items-center space-x-2 mb-8 flex-shrink-0">
          <div className="text-red-500 text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8">
              <path
                fillRule="evenodd"
                d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="font-bold text-2xl bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
            FireBeats
          </h1>
        </div>
        {/* Navigation Section */}
        <nav className="mb-6 flex-shrink-0">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.to} // Use 'to' prop for navigation
                className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  // Use location.pathname for active styling
                  location.pathname === item.to
                    ? "bg-gray-800 text-red-500"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                // Remove onClick handler
              >
                <item.icon size={20} className="mr-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </ul>
        </nav>
        {/* Divider - unchanged */}
        <div className="h-px bg-gray-800 my-4 flex-shrink-0"></div>
        {/* Playlist Section (Scrollable) */}
        <div className="flex-grow overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 px-4 flex-shrink-0">
            <span className="font-medium text-gray-400">Playlists</span>
            {/* Add onClick handler to the button */}
            <button
              onClick={handleAddPlaylist} // Call the handler function
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
              title="Create playlist" // Add a tooltip
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="overflow-y-auto flex-grow custom-scrollbar">
            <div className="space-y-1 pb-4">
              {playlists.map((playlist) => (
                // Replace div with Link
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`} // Dynamic route for playlists
                  // Update active state styling based on location.pathname
                  className={`flex items-center p-2 mx-2 rounded-md hover:bg-gray-800 cursor-pointer transition-colors ${
                    location.pathname === `/playlist/${playlist.id}`
                      ? "bg-gray-700 text-white" // Style for active playlist
                      : "text-gray-400"
                  }`}
                  // Remove onClick handler
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-amber-500 rounded-md flex items-center justify-center flex-shrink-0 mr-3">
                    <playlist.icon size={20} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`font-medium truncate ${
                        location.pathname === `/playlist/${playlist.id}`
                          ? "text-white"
                          : ""
                      }`}>
                      {playlist.name}
                    </h4>
                    <p className="text-sm text-gray-400 truncate">
                      {playlist.count}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
