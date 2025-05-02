import React, { useEffect, useState } from "react";
// Import useParams
import { useParams } from "react-router-dom";
// Import API functions if needed
// import { getAlbum } from '../services/spotifyApi';

const AlbumView = ({ onPlaySong }) => {
  // Get albumId from URL parameters
  const { albumId } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch album data based on albumId
    const fetchAlbum = async () => {
      setIsLoading(true);
      console.log(`Fetching data for album: ${albumId}`);
      try {
        // const data = await getAlbum(albumId); // Replace with actual API call
        // setAlbumData(data);
        setAlbumData({ name: `Album ${albumId}` }); // Placeholder
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  if (isLoading) return <div className="p-8">Loading album...</div>;
  if (!albumData) return <div className="p-8">Album not found.</div>;

  // Placeholder content - replace with actual album details
  return (
    <div className="flex-grow overflow-y-auto px-8 py-6 custom-scrollbar">
      <h2 className="text-3xl font-bold mb-6">{albumData.name}</h2>
      {/* Add album details, track list, etc. here */}
      <p>Displaying content for album ID: {albumId}</p>
    </div>
  );
};

export default AlbumView;
