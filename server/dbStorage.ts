import { db } from './db';
import { eq, desc } from 'drizzle-orm';
import { 
  users, type User, type InsertUser,
  energyData, type EnergyData, type InsertEnergyData,
  officeZones, type OfficeZone, type InsertOfficeZone,
  recommendations, type Recommendation, type InsertRecommendation
} from "@shared/schema";
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  async updateUserAwePoints(id: number, points: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ awePoints: points })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || undefined;
  }
  
  async getUserLeaderboard(limit: number): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.awePoints))
      .limit(limit);
  }
  
  // Energy data operations
  async getEnergyData(days: number): Promise<EnergyData[]> {
    // Get the data sorted by date (newest first) and limited to the number of days requested
    return await db
      .select()
      .from(energyData)
      .orderBy(desc(energyData.date))
      .limit(days);
  }
  
  async getLatestEnergyData(): Promise<EnergyData | undefined> {
    const [latestData] = await db
      .select()
      .from(energyData)
      .orderBy(desc(energyData.date))
      .limit(1);
    
    return latestData || undefined;
  }
  
  async createEnergyData(data: InsertEnergyData): Promise<EnergyData> {
    const [newData] = await db
      .insert(energyData)
      .values(data)
      .returning();
    
    return newData;
  }
  
  // Office zones operations
  async getAllOfficeZones(): Promise<OfficeZone[]> {
    return await db.select().from(officeZones);
  }
  
  async updateOfficeZone(id: number, data: Partial<InsertOfficeZone>): Promise<OfficeZone | undefined> {
    const [updatedZone] = await db
      .update(officeZones)
      .set(data)
      .where(eq(officeZones.id, id))
      .returning();
    
    return updatedZone || undefined;
  }
  
  async createOfficeZone(zone: InsertOfficeZone): Promise<OfficeZone> {
    const [newZone] = await db
      .insert(officeZones)
      .values(zone)
      .returning();
    
    return newZone;
  }
  
  // Recommendations operations
  async getAllRecommendations(): Promise<Recommendation[]> {
    return await db.select().from(recommendations);
  }
  
  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [newRecommendation] = await db
      .insert(recommendations)
      .values(recommendation)
      .returning();
    
    return newRecommendation;
  }
  
  async applyRecommendation(id: number): Promise<Recommendation | undefined> {
    const [updatedRecommendation] = await db
      .update(recommendations)
      .set({ isApplied: true })
      .where(eq(recommendations.id, id))
      .returning();
    
    return updatedRecommendation || undefined;
  }

  // Initialize the database with sample data if it's empty
  async initializeSampleData() {
    // Check if users table is empty
    const userCount = await db.select().from(users);
    if (userCount.length > 0) {
      return; // Data already exists, don't initialize
    }

    // Sample users
    const sampleUsers: InsertUser[] = [
      { 
        username: "jwilson", 
        password: "password", 
        fullName: "James Wilson", 
        department: "Product Design", 
        avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a" 
      },
      { 
        username: "schen", 
        password: "password", 
        fullName: "Sarah Chen", 
        department: "Engineering", 
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" 
      },
      { 
        username: "mjohnson", 
        password: "password", 
        fullName: "Michael Johnson", 
        department: "Marketing", 
        avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7" 
      },
      { 
        username: "erodriguez", 
        password: "password", 
        fullName: "Emily Rodriguez", 
        department: "Customer Success", 
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956" 
      },
      { 
        username: "dkim", 
        password: "password", 
        fullName: "David Kim", 
        department: "Finance", 
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
      },
      { 
        username: "ethompson", 
        password: "password", 
        fullName: "Emma Thompson", 
        department: "Sustainability Manager", 
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
      }
    ];
    
    // Add users with different awe points
    for (const user of sampleUsers) {
      await this.createUser(user);
    }
    
    // Update awe points for the users
    const createdUsers = await this.getAllUsers();
    await this.updateUserAwePoints(createdUsers[0].id, 1254);
    await this.updateUserAwePoints(createdUsers[1].id, 1142);
    await this.updateUserAwePoints(createdUsers[2].id, 987);
    await this.updateUserAwePoints(createdUsers[3].id, 843);
    await this.updateUserAwePoints(createdUsers[4].id, 776);
    await this.updateUserAwePoints(createdUsers[5].id, 650);
    
    // Sample energy data for the past 7 days
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Sample data that roughly matches the chart in the design
      const lightingKwh = 28 + Math.floor(Math.random() * 20); // Between 28-48
      const acKwh = 41 + Math.floor(Math.random() * 13); // Between 41-54
      const devicesKwh = 29 + Math.floor(Math.random() * 10); // Between 29-39
      const totalKwh = lightingKwh + acKwh + devicesKwh;
      const co2Emissions = Math.round(totalKwh * 0.42); // Rough conversion factor
      
      await this.createEnergyData({
        date,
        lightingKwh,
        acKwh,
        devicesKwh,
        totalKwh,
        co2Emissions
      });
    }
    
    // Sample office zones
    const sampleZones: InsertOfficeZone[] = [
      {
        name: "West Wing",
        currentUsageKw: 4.8,
        averageUsageKw: 3.93,
        usageStatus: "High Usage",
        percentFromAverage: 22
      },
      {
        name: "East Wing",
        currentUsageKw: 3.2,
        averageUsageKw: 3.05,
        usageStatus: "Medium Usage",
        percentFromAverage: 5
      },
      {
        name: "North Wing",
        currentUsageKw: 1.9,
        averageUsageKw: 2.16,
        usageStatus: "Low Usage",
        percentFromAverage: -12
      },
      {
        name: "Conference Rooms",
        currentUsageKw: 2.3,
        averageUsageKw: 2.3,
        usageStatus: "Optimal",
        percentFromAverage: 0
      }
    ];
    
    for (const zone of sampleZones) {
      await this.createOfficeZone(zone);
    }
    
    // Sample recommendations
    const sampleRecommendations: InsertRecommendation[] = [
      {
        title: "Optimize AC Zones",
        description: "The west wing is being overcooled. Adjust temperature settings by 2°C to save approximately 42 kWh daily.",
        category: "AC",
        potentialSavings: "42 kWh daily",
        isApplied: false
      },
      {
        title: "Seating Arrangement",
        description: "Consolidate seating in the north area during low occupancy days (Mon & Fri) to reduce lighting and AC needs by 18%.",
        category: "Seating",
        potentialSavings: "18% reduction",
        isApplied: false
      },
      {
        title: "Dark Mode Reminder",
        description: "35% of laptops are not using dark mode. Enable it during daylight hours to reduce screen energy usage by 8-12%.",
        category: "Devices",
        potentialSavings: "8-12% reduction",
        isApplied: false
      },
      {
        title: "Natural Light Utilization",
        description: "The eastern conference rooms are using artificial lighting despite adequate natural light. Estimated savings: 28 kWh/day.",
        category: "Lighting",
        potentialSavings: "28 kWh/day",
        isApplied: false
      }
    ];
    
    for (const rec of sampleRecommendations) {
      await this.createRecommendation(rec);
    }
  }
}