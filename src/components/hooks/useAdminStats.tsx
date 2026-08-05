import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export interface PlanSubscriptionStat {
  planId: string;
  planName: string;
  planSlug: string;
  interval: string;
  currency: string;
  price: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  canceledSubscriptions: number;
  failedSubscriptions: number;
  recurringRevenue: number;
  churnRate: number;
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  activeSubscriptions: number;
  recurringRevenue: number;
  realizedSubscriptionRevenue: number;
  churnRate: number; // 👉 Global Churn Rate
  planSubscriptionStats: PlanSubscriptionStat[]; // 👉 Per-Plan Data
  // ... any other fields you need
}

// 1. Overview stats (/admin/stats)
export const fetchAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
  });
};

// 2. Platform & Subscription stats (/admin/platform-stats)
export const fetchPlatformStats = async () => {
  const response = await api.get("/admin/platform-stats");
  return response.data;
};

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: fetchPlatformStats,
  });
};

// 3. Registration Trends (/admin/registrations)
export const fetchRegistrationTrends = async (period?: string) => {
  const response = await api.get("/admin/registrations", { params: { period } });
  return response.data;
};

export const useRegistrationTrends = (period?: string) => {
  return useQuery({
    queryKey: ["registration-trends", period],
    queryFn: () => fetchRegistrationTrends(period),
  });
};

// 4. Financial Summary Report (/admin/reports/financial-summary)
export const fetchFinancialSummary = async () => {
  const response = await api.get("/admin/reports/financial-summary");
  return response.data;
};

export const useFinancialSummary = () => {
  return useQuery({
    queryKey: ["financial-summary"],
    queryFn: fetchFinancialSummary,
  });
};