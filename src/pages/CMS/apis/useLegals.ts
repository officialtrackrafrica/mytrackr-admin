import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export interface LegalParams {
  page?: number;
  limit?: number;
  search?: string;
}

// --- TERMS AND CONDITIONS ---
export const useTerms = (params?: LegalParams) => {
  return useQuery({
    queryKey: ["legal-terms", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/legal/terms", { params });
      return data;
    },
  });
};

export const useDeleteTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/legal/terms/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["legal-terms"] }),
  });
};

// --- PRIVACY POLICIES ---
export const usePolicies = (params?: LegalParams) => {
  return useQuery({
    queryKey: ["legal-policies", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/legal/privacy-policies", { params });
      return data;
    },
  });
};

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/legal/privacy-policies/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["legal-policies"] }),
  });
};

// --- SPECIFIC TERMS HOOKS (For Create/Edit) ---
export const useTerm = (id?: string) => {
  return useQuery({
    queryKey: ["legal-term", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/admin/legal/terms/${id}`);
      return data?.term || data?.data || data;
    },
    enabled: !!id, // Only run the query if an ID is provided (Edit mode)
  });
};

export const useCreateTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; content: string; effectiveAt: string }) => {
      const { data } = await api.post("/admin/legal/terms", payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["legal-terms"] }),
  });
};

export const useUpdateTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; title?: string; content?: string; effectiveAt?: string }) => {
      const { data } = await api.patch(`/admin/legal/terms/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["legal-terms"] }),
  });
};

// --- SPECIFIC POLICIES HOOKS (For Create/Edit) ---
export const usePolicy = (id?: string) => {
  return useQuery({
    queryKey: ["legal-policy", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/admin/legal/privacy-policies/${id}`);
      return data?.policy || data?.data || data;
    },
    enabled: !!id,
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; content: string; effectiveAt: string }) => {
      const { data } = await api.post("/admin/legal/privacy-policies", payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["legal-policies"] }),
  });
};

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; title?: string; content?: string; effectiveAt?: string }) => {
      const { data } = await api.patch(`/admin/legal/privacy-policies/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["legal-policies"] }),
  });
};