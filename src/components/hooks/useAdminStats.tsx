import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

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