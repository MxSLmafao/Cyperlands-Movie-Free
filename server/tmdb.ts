import { RequestHandler } from "express";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const tmdbHandler: RequestHandler = async (req, res) => {
  try {
    const endpoint = req.params[0];
    
    if (!endpoint || endpoint === 'null') {
      console.error('[TMDB] Invalid endpoint:', endpoint);
      return res.status(400).json({ 
        error: "Invalid endpoint",
        message: "A valid TMDB endpoint is required" 
      });
    }

    if (!TMDB_API_KEY) {
      console.error('[TMDB] Missing API key');
      return res.status(500).json({ 
        error: "Configuration error",
        message: "TMDB API key is not configured" 
      });
    }

    const queryParams = new URLSearchParams({
      ...req.query,
      api_key: TMDB_API_KEY,
      language: 'en-US'
    });

    const url = `${TMDB_BASE_URL}/${endpoint}?${queryParams}`;
    console.log(`[TMDB] Fetching: ${endpoint}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`[TMDB] Error ${response.status}: ${response.statusText}`);
      console.error(`[TMDB] URL: ${url}`);
      console.error(`[TMDB] Response:`, await response.text());
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data) {
      console.error('[TMDB] No data received from API');
      throw new Error('No data received from TMDB API');
    }

    console.log(`[TMDB] Success: ${endpoint}`);
    res.json(data);
  } catch (error: any) {
    console.error('[TMDB] Error:', {
      message: error.message,
      stack: error.stack,
      endpoint: req.params[0]
    });
    res.status(500).json({ 
      error: "Failed to fetch from TMDB",
      message: error.message 
    });
  }
};
