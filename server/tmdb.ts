import { RequestHandler } from "express";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const tmdbHandler: RequestHandler = async (req, res) => {
  try {
    const endpoint = req.params[0];
    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
};
