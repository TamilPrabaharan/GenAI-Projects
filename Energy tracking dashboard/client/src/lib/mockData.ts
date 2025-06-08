// This file is not used in production
// It contains types and interfaces for reference in development

export interface DashboardSummary {
  energyUsage: {
    total: number;
    target: number;
    percentage: number;
    breakdown: {
      lighting: number;
      ac: number;
      devices: number;
    };
  };
  co2: {
    total: number;
    target: number;
    percentage: number;
    breakdown: {
      lighting: number;
      ac: number;
      devices: number;
      other: number;
    };
    offset: {
      current: number;
      target: number;
      percentage: number;
      treesEquivalent: number;
    };
  };
  awePoints: {
    total: number;
    target: number;
    percentage: number;
  };
  users: {
    active: number;
    total: number;
    percentage: number;
  };
  topUsers: {
    id: number;
    fullName: string;
    department: string;
    avatarUrl: string;
    awePoints: number;
  }[];
  recommendations: {
    id: number;
    title: string;
    description: string;
    category: string;
    potentialSavings: string;
    isApplied: boolean;
  }[];
  zones: {
    id: number;
    name: string;
    currentUsageKw: number;
    averageUsageKw: number;
    usageStatus: string;
    percentFromAverage: number;
  }[];
}

export interface EnergyData {
  date: Date;
  lightingKwh: number;
  acKwh: number;
  devicesKwh: number;
  totalKwh: number;
  co2Emissions: number;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  department: string;
  avatarUrl: string;
  awePoints: number;
}

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  potentialSavings: string;
  isApplied: boolean;
  createdAt: Date;
}

export interface OfficeZone {
  id: number;
  name: string;
  currentUsageKw: number;
  averageUsageKw: number;
  usageStatus: string;
  percentFromAverage: number;
}
