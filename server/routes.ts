import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // In this camera application, most processing happens client-side
  // The server mainly serves the static files and provides basic API endpoints
  // Future endpoints could include:
  // - Image storage/retrieval
  // - Processing settings persistence
  // - Sharing functionality

  const httpServer = createServer(app);
  return httpServer;
}
