import { api } from "@/services/api";
import { useQuery, useMutation } from "@tanstack/react-query";

// GET: Get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data;
    },
  });
};

//  POST: Change user password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      // Adjust the endpoint path or method (POST/PUT) if your API differs
      const response = await api.post("/users/change-password", data);
      return response.data;
    },
  });
};

//  Add the interface for log parameters
export interface GetLogsParams {
  page?: number;
  limit?: number;
}

//  Update the GET hook to accept and pass the parameters
export const useAuditLogs = (params?: GetLogsParams) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: async () => {
      const response = await api.get("/admin/audit-logs", { params });
      return response.data;
    },
  });
};