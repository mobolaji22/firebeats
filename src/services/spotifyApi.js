import axios from 'axios';

const BASE_URL = 'https://spotify23.p.rapidapi.com';
const API_KEY = '63434cc2b0mshf8eee09423bc8cfp1df962jsn0377ab9e3079';

const spotifyApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
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