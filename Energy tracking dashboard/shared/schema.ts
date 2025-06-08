import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users/Employees Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  department: text("department").notNull(),
  avatarUrl: text("avatar_url"),
  awePoints: integer("awe_points").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  department: true,
  avatarUrl: true,
});

// Energy Consumption Table
export const energyData = pgTable("energy_data", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  lightingKwh: real("lighting_kwh").notNull(),
  acKwh: real("ac_kwh").notNull(),
  devicesKwh: real("devices_kwh").notNull(),
  totalKwh: real("total_kwh").notNull(),
  co2Emissions: real("co2_emissions").notNull(), // in kg
});

export const insertEnergyDataSchema = createInsertSchema(energyData).pick({
  date: true,
  lightingKwh: true,
  acKwh: true,
  devicesKwh: true,
  totalKwh: true,
  co2Emissions: true,
});

// Office Zones Table
export const officeZones = pgTable("office_zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  currentUsageKw: real("current_usage_kw").notNull(),
  averageUsageKw: real("average_usage_kw").notNull(),
  usageStatus: text("usage_status").notNull(), // "High", "Medium", "Low", "Optimal"
  percentFromAverage: real("percent_from_average").notNull(),
});

export const insertOfficeZoneSchema = createInsertSchema(officeZones).pick({
  name: true,
  currentUsageKw: true,
  averageUsageKw: true,
  usageStatus: true,
  percentFromAverage: true,
});

// AI Recommendations Table
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "AC", "Seating", "Devices", "Lighting"
  potentialSavings: text("potential_savings"),
  isApplied: boolean("is_applied").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).pick({
  title: true,
  description: true,
  category: true,
  potentialSavings: true,
  isApplied: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type EnergyData = typeof energyData.$inferSelect;
export type InsertEnergyData = z.infer<typeof insertEnergyDataSchema>;

export type OfficeZone = typeof officeZones.$inferSelect;
export type InsertOfficeZone = z.infer<typeof insertOfficeZoneSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
