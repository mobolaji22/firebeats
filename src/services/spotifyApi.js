import axios from 'axios';

const BASE_URL = 'https://spotify23.p.rapidapi.com';
// Read the API key from environment variables
const API_KEY = import.meta.env.VITE_SPOTIFY_API_KEY;

const spotifyApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY, // Use the variable here
    'x-rapidapi-host': 'spotify23.p.rapidapi.com'
  }
});

export const searchMulti = async (query) => {
  try {
    const response = await spotifyApi.get('/search/', {
      params: {
        type: 'multi',
        offset: '0',
        limit: '10',
        numberOfTopResults: '5',
        q: query
      }
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

export const getTrack = async (trackId) => {
  try {
    const response = await spotifyApi.get('/tracks/', {
      params: {
        ids: trackId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get track error:', error);
    throw error;
  }
};

export const getTrackDetails = async (trackId) => {
  try {
    const response = await spotifyApi.get('/track_details/', {
      params: {
        id: trackId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get track details error:', error);
    throw error;
  }
};

export const getRecommendations = async (params) => {
  try {
    // Ensure API_KEY is available before making the request
    if (!API_KEY) {
      throw new Error("Spotify API Key is missing. Make sure it's set in your .env file as VITE_SPOTIFY_API_KEY.");
    }
    const response = await spotifyApi.get('/recommendations/', {
      params: {
        limit: params.limit || '20',
        seed_tracks: params.seedTracks,
        seed_artists: params.seedArtists,
        seed_genres: params.seedGenres
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get recommendations error:', error);
    // Optionally re-throw or handle specific errors like missing key
    if (error.message.includes("Spotify API Key is missing")) {
       alert(error.message); // Or display a more user-friendly message
    }
    throw error;
  }
};

export const getPlaylist = async (playlistId) => {
  try {
    const response = await spotifyApi.get('/playlist/', {
      params: {
        id: playlistId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get playlist error:', error);
    throw error;
  }
};

export const getPlaylistTracks = async (playlistId, offset = 0, limit = 100) => {
  try {
    const response = await spotifyApi.get('/playlist_tracks/', {
      params: {
        id: playlistId,
        offset: offset.toString(),
        limit: limit.toString()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get playlist tracks error:', error);
    throw error;
  }
};