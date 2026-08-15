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

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
  period?: string; 
  [key: string]: any; // Catch-all for any other filter params
}

// 1. Overview stats (/admin/stats)
export const fetchAdminStats = async (params?: DateRangeParams) => {
  const response = await api.get("/admin/stats", { params });
  return response.data;
};

export const useAdminStats = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ["admin-stats", params], 
    queryFn: () => fetchAdminStats(params),
  });
};

// 2. Platform & Subscription stats (/admin/platform-stats)
export const fetchPlatformStats = async (params?: DateRangeParams) => {
  const response = await api.get("/admin/platform-stats", { params });
  return response.data;
};

export const usePlatformStats = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ["platform-stats", params], // 👉 Added params to queryKey
    queryFn: () => fetchPlatformStats(params),
  });
};

// 3. Registration Trends (/admin/registrations)
export const fetchRegistrationTrends = async (params?: DateRangeParams) => {
  const response = await api.get("/admin/registrations", { params });
  return response.data;
};

export const useRegistrationTrends = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ["registration-trends", params], // 👉 Added params to queryKey
    queryFn: () => fetchRegistrationTrends(params),
  });
};

// 4. Financial Summary Report (/admin/reports/financial-summary)
export const fetchFinancialSummary = async (params?: DateRangeParams) => {
  const response = await api.get("/admin/reports/financial-summary", { params });
  return response.data;
};

export const useFinancialSummary = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ["financial-summary", params], // 👉 Added params to queryKey
    queryFn: () => fetchFinancialSummary(params),
  });
};

