import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CategorizationRule {
  id: string;
  _id?: string;
  category: string;
  subCategories?: string[];
  keywords: string | string[];
}

// Updated to match image_a46e04.png exactly
export interface CreateRulePayload {
  category: string;
  subCategory?: string; // Changed from subCategories array to string
  keywords: string[];   // Forced to array
  priority?: number;
  isActive?: boolean;
}
export interface GetRulesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

// 👉 GET: List categorization rules
export const useCategorizationRules = (params?: GetRulesParams) => {
  return useQuery({
    queryKey: ["categorization-rules", params],
    queryFn: async () => {
      const response = await api.get("/admin/categorization-rules", {params});
      return response.data;
    },
  });
};

// 👉 POST: Create categorization rule keywords for a category
export const useCreateCategorizationRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateRulePayload) => {
      const response = await api.post("/admin/categorization-rules", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorization-rules"] });
    },
  });
};

// 👉 PATCH: Update a categorization rule group
export const useUpdateCategorizationRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateRulePayload> }) => {
      const response = await api.patch(`/admin/categorization-rules/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorization-rules"] });
    },
  });
};

// 👉 DELETE: Delete a categorization rule group
export const useDeleteCategorizationRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/categorization-rules/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorization-rules"] });
    },
  });
};