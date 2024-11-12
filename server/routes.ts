import { Express } from "express";
import { tmdbHandler } from "./tmdb";

export function registerRoutes(app: Express) {
  // TMDB API proxy
  app.get("/api/tmdb/*", tmdbHandler);
}