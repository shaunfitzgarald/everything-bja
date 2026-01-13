/**
 * TMDb Service
 * 
 * This service handles communication with The Movie Database (TMDb) API.
 * 
 * Note: Requires a VITE_TMDB_API_KEY in .env.
 * Documentation: https://developer.themoviedb.org/docs
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTmdbCredits = async (personId, apiKey) => {
  const finalApiKey = apiKey || import.meta.env.VITE_TMDB_API_KEY;
  
  if (!finalApiKey) {
    throw new Error("TMDb API Key is required. Set VITE_TMDB_API_KEY in your .env file.");
  }

  try {
    // Fetch combined credits (movie + tv)
    const url = `${TMDB_BASE_URL}/person/${personId}/combined_credits?api_key=${finalApiKey}&language=en-US`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDb API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("TMDb API Error:", error);
    throw error;
  }
};

export const fetchTmdbPerson = async (personId, apiKey) => {
  const finalApiKey = apiKey || import.meta.env.VITE_TMDB_API_KEY;
  
  if (!finalApiKey) return null;

  try {
    const url = `${TMDB_BASE_URL}/person/${personId}?api_key=${finalApiKey}&language=en-US`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("TMDb Person Error:", error);
    return null;
  }
};
