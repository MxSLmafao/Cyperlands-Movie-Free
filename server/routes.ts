import { Express } from "express";
import { setupAuth } from "./auth";
import { tmdbHandler } from "./tmdb";
import { db } from "db";
import { watchlist } from "db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Auth routes
  setupAuth(app);

  // TMDB API proxy
  app.get("/api/tmdb/*", tmdbHandler);

  // Watchlist routes
  app.post("/api/watchlist", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { movieId } = req.body;
    
    try {
      await db.insert(watchlist).values({
        userId: req.user.id,
        movieId,
      });
      res.json({ message: "Added to watchlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });

  app.get("/api/watchlist", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const items = await db
        .select()
        .from(watchlist)
        .where(eq(watchlist.userId, req.user.id));
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  app.delete("/api/watchlist/:movieId", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await db
        .delete(watchlist)
        .where(eq(watchlist.userId, req.user.id))
        .where(eq(watchlist.movieId, parseInt(req.params.movieId)));
      res.json({ message: "Removed from watchlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });
}
