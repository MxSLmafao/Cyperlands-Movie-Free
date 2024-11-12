import { Express } from "express";
import { tmdbHandler } from "./tmdb";
import { setupAuth } from "./auth";
import { db } from "db";
import { watchlist } from "db/schema";
import { eq, and } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Set up authentication routes
  setupAuth(app);

  // TMDB API proxy
  app.get("/api/tmdb/*", tmdbHandler);

  // Watchlist routes
  app.get("/api/watchlist", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const items = await db
        .select()
        .from(watchlist)
        .where(eq(watchlist.userId, req.user.id));
      res.json(items);
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist/:movieId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const movieId = parseInt(req.params.movieId);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    try {
      // Check if movie is already in watchlist
      const [existing] = await db
        .select()
        .from(watchlist)
        .where(
          and(
            eq(watchlist.userId, req.user.id),
            eq(watchlist.movieId, movieId)
          )
        )
        .limit(1);

      if (existing) {
        return res.status(400).json({ message: "Movie already in watchlist" });
      }

      // Add to watchlist
      await db.insert(watchlist).values({
        userId: req.user.id,
        movieId: movieId,
      });

      res.json({ message: "Added to watchlist" });
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:movieId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const movieId = parseInt(req.params.movieId);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    try {
      await db
        .delete(watchlist)
        .where(
          and(
            eq(watchlist.userId, req.user.id),
            eq(watchlist.movieId, movieId)
          )
        );
      res.json({ message: "Removed from watchlist" });
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });
}
