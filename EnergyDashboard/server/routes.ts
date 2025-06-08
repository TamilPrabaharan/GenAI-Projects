import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertRecommendationSchema, insertUserSchema, insertEnergyDataSchema, insertOfficeZoneSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the energy tracking dashboard
  const apiRouter = app.route("/api");

  // User endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getUserLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const parsedBody = insertUserSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: parsedBody.error.errors 
        });
      }
      
      const newUser = await storage.createUser(parsedBody.data);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id/points", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pointsSchema = z.object({ points: z.number() });
      const parsedBody = pointsSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid points data", 
          errors: parsedBody.error.errors 
        });
      }
      
      const updatedUser = await storage.updateUserAwePoints(id, parsedBody.data.points);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update points" });
    }
  });

  // Energy data endpoints
  app.get("/api/energy", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const energyData = await storage.getEnergyData(days);
      res.json(energyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch energy data" });
    }
  });

  app.get("/api/energy/latest", async (req, res) => {
    try {
      const latestData = await storage.getLatestEnergyData();
      
      if (!latestData) {
        return res.status(404).json({ message: "No energy data available" });
      }
      
      res.json(latestData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest energy data" });
    }
  });

  app.post("/api/energy", async (req, res) => {
    try {
      const parsedBody = insertEnergyDataSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid energy data", 
          errors: parsedBody.error.errors 
        });
      }
      
      const newEnergyData = await storage.createEnergyData(parsedBody.data);
      res.status(201).json(newEnergyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to create energy data" });
    }
  });

  // Office zones endpoints
  app.get("/api/zones", async (req, res) => {
    try {
      const zones = await storage.getAllOfficeZones();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch office zones" });
    }
  });

  app.patch("/api/zones/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedBody = insertOfficeZoneSchema.partial().safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid zone data", 
          errors: parsedBody.error.errors 
        });
      }
      
      const updatedZone = await storage.updateOfficeZone(id, parsedBody.data);
      
      if (!updatedZone) {
        return res.status(404).json({ message: "Zone not found" });
      }
      
      res.json(updatedZone);
    } catch (error) {
      res.status(500).json({ message: "Failed to update zone" });
    }
  });

  // Recommendations endpoints
  app.get("/api/recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getAllRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post("/api/recommendations", async (req, res) => {
    try {
      const parsedBody = insertRecommendationSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid recommendation data", 
          errors: parsedBody.error.errors 
        });
      }
      
      const newRecommendation = await storage.createRecommendation(parsedBody.data);
      res.status(201).json(newRecommendation);
    } catch (error) {
      res.status(500).json({ message: "Failed to create recommendation" });
    }
  });

  app.post("/api/recommendations/:id/apply", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedRecommendation = await storage.applyRecommendation(id);
      
      if (!updatedRecommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      
      res.json(updatedRecommendation);
    } catch (error) {
      res.status(500).json({ message: "Failed to apply recommendation" });
    }
  });

  // Dashboard summary endpoint
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const latestEnergyData = await storage.getLatestEnergyData();
      const leaderboard = await storage.getUserLeaderboard(5);
      const recommendations = await storage.getAllRecommendations();
      const zones = await storage.getAllOfficeZones();
      
      // Calculate total Awe Points across all users
      const users = await storage.getAllUsers();
      const totalAwePoints = users.reduce((sum, user) => sum + user.awePoints, 0);
      
      // Calculate active users (all users are considered active in the mock data)
      const activeUsers = users.length;
      const totalUsers = 50; // Hardcoded as in the design
      
      res.json({
        energyUsage: {
          total: latestEnergyData?.totalKwh || 0,
          target: 660, // From the design
          percentage: latestEnergyData ? Math.round((latestEnergyData.totalKwh / 660) * 100) : 0,
          breakdown: {
            lighting: latestEnergyData?.lightingKwh || 0,
            ac: latestEnergyData?.acKwh || 0,
            devices: latestEnergyData?.devicesKwh || 0
          }
        },
        co2: {
          total: latestEnergyData?.co2Emissions || 0,
          target: 290, // From the design
          percentage: latestEnergyData ? Math.round((latestEnergyData.co2Emissions / 290) * 100) : 0,
          breakdown: {
            lighting: 98, // From the design
            ac: 126,
            devices: 82,
            other: 14
          },
          offset: {
            current: 245, // From the design
            target: 320,
            percentage: 76,
            treesEquivalent: 12
          }
        },
        awePoints: {
          total: totalAwePoints,
          target: 3000, // From the design
          percentage: Math.round((totalAwePoints / 3000) * 100)
        },
        users: {
          active: activeUsers,
          total: totalUsers,
          percentage: Math.round((activeUsers / totalUsers) * 100)
        },
        topUsers: leaderboard,
        recommendations: recommendations,
        zones: zones
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
