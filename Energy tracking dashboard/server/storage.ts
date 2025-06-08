import { 
  users, type User, type InsertUser,
  energyData, type EnergyData, type InsertEnergyData,
  officeZones, type OfficeZone, type InsertOfficeZone,
  recommendations, type Recommendation, type InsertRecommendation
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserAwePoints(id: number, points: number): Promise<User | undefined>;
  getUserLeaderboard(limit: number): Promise<User[]>;
  
  // Energy data operations
  getEnergyData(days: number): Promise<EnergyData[]>;
  getLatestEnergyData(): Promise<EnergyData | undefined>;
  createEnergyData(data: InsertEnergyData): Promise<EnergyData>;
  
  // Office zones operations
  getAllOfficeZones(): Promise<OfficeZone[]>;
  updateOfficeZone(id: number, data: Partial<InsertOfficeZone>): Promise<OfficeZone | undefined>;
  createOfficeZone(zone: InsertOfficeZone): Promise<OfficeZone>;
  
  // Recommendations operations
  getAllRecommendations(): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  applyRecommendation(id: number): Promise<Recommendation | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private energyData: Map<number, EnergyData>;
  private officeZones: Map<number, OfficeZone>;
  private recommendations: Map<number, Recommendation>;
  private userCurrentId: number;
  private energyDataCurrentId: number;
  private officeZonesCurrentId: number;
  private recommendationsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.energyData = new Map();
    this.officeZones = new Map();
    this.recommendations = new Map();
    this.userCurrentId = 1;
    this.energyDataCurrentId = 1;
    this.officeZonesCurrentId = 1;
    this.recommendationsCurrentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
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
    this.createUser({ ...sampleUsers[0] }).then(user => {
      this.updateUserAwePoints(user.id, 1254);
    });
    this.createUser({ ...sampleUsers[1] }).then(user => {
      this.updateUserAwePoints(user.id, 1142);
    });
    this.createUser({ ...sampleUsers[2] }).then(user => {
      this.updateUserAwePoints(user.id, 987);
    });
    this.createUser({ ...sampleUsers[3] }).then(user => {
      this.updateUserAwePoints(user.id, 843);
    });
    this.createUser({ ...sampleUsers[4] }).then(user => {
      this.updateUserAwePoints(user.id, 776);
    });
    this.createUser({ ...sampleUsers[5] }).then(user => {
      this.updateUserAwePoints(user.id, 650);
    });
    
    // Sample energy data for the past 7 days
    const today = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Sample data that roughly matches the chart in the design
      const lightingKwh = 28 + Math.floor(Math.random() * 20); // Between 28-48
      const acKwh = 41 + Math.floor(Math.random() * 13); // Between 41-54
      const devicesKwh = 29 + Math.floor(Math.random() * 10); // Between 29-39
      const totalKwh = lightingKwh + acKwh + devicesKwh;
      const co2Emissions = Math.round(totalKwh * 0.42); // Rough conversion factor
      
      this.createEnergyData({
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
    
    sampleZones.forEach(zone => this.createOfficeZone(zone));
    
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
    
    sampleRecommendations.forEach(rec => this.createRecommendation(rec));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id, awePoints: 0, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUserAwePoints(id: number, points: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, awePoints: points };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getUserLeaderboard(limit: number): Promise<User[]> {
    const sortedUsers = Array.from(this.users.values())
      .sort((a, b) => b.awePoints - a.awePoints);
    
    return sortedUsers.slice(0, limit);
  }
  
  // Energy data operations
  async getEnergyData(days: number): Promise<EnergyData[]> {
    const allData = Array.from(this.energyData.values());
    
    // Sort by date (newest first) and take the requested number of days
    return allData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, days);
  }
  
  async getLatestEnergyData(): Promise<EnergyData | undefined> {
    const allData = Array.from(this.energyData.values());
    if (allData.length === 0) return undefined;
    
    return allData.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }
  
  async createEnergyData(data: InsertEnergyData): Promise<EnergyData> {
    const id = this.energyDataCurrentId++;
    const energyData: EnergyData = { ...data, id };
    this.energyData.set(id, energyData);
    return energyData;
  }
  
  // Office zones operations
  async getAllOfficeZones(): Promise<OfficeZone[]> {
    return Array.from(this.officeZones.values());
  }
  
  async updateOfficeZone(id: number, data: Partial<InsertOfficeZone>): Promise<OfficeZone | undefined> {
    const zone = this.officeZones.get(id);
    if (!zone) return undefined;
    
    const updatedZone = { ...zone, ...data };
    this.officeZones.set(id, updatedZone);
    return updatedZone;
  }
  
  async createOfficeZone(zone: InsertOfficeZone): Promise<OfficeZone> {
    const id = this.officeZonesCurrentId++;
    const officeZone: OfficeZone = { ...zone, id };
    this.officeZones.set(id, officeZone);
    return officeZone;
  }
  
  // Recommendations operations
  async getAllRecommendations(): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values());
  }
  
  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.recommendationsCurrentId++;
    const now = new Date();
    const newRecommendation: Recommendation = { ...recommendation, id, createdAt: now };
    this.recommendations.set(id, newRecommendation);
    return newRecommendation;
  }
  
  async applyRecommendation(id: number): Promise<Recommendation | undefined> {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) return undefined;
    
    const updatedRecommendation = { ...recommendation, isApplied: true };
    this.recommendations.set(id, updatedRecommendation);
    return updatedRecommendation;
  }
}

// Import the DatabaseStorage
import { DatabaseStorage } from './dbStorage';

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
