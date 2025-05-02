import React, { useEffect, useState } from "react";
// Import useParams
import { useParams } from "react-router-dom";
// Import API functions if needed
// import { getArtist } from '../services/spotifyApi';

const ArtistView = ({ onPlaySong }) => {
  // Get artistId from URL parameters
  const { artistId } = useParams();
  const [artistData, setArtistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch artist data based on artistId
    const fetchArtist = async () => {
      setIsLoading(true);
      console.log(`Fetching data for artist: ${artistId}`);
      try {
        // const data = await getArtist(artistId); // Replace with actual API call
        // setArtistData(data);
        setArtistData({ name: `Artist ${artistId}` }); // Placeholder
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (artistId) {
      fetchArtist();
    }
  }, [artistId]);

  if (isLoading) return <div className="p-8">Loading artist...</div>;
  if (!artistData) return <div className="p-8">Artist not found.</div>;

  // Placeholder content - replace with actual artist details
  return (
    <div className="flex-grow overflow-y-auto px-8 py-6 custom-scrollbar">
      <h2 className="text-3xl font-bold mb-6">{artistData.name}</h2>
      {/* Add artist details, top tracks, albums, etc. here */}
      <p>Displaying content for artist ID: {artistId}</p>
    </div>
  );
};

export default ArtistView;
