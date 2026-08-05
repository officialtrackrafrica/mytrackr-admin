import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface Faq {
  id: string;
  _id?: string;
  question: string;
  answer: string;
  category?: string;
}

export interface GetFaqsParams {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export interface CreateFaqPayload {
  question: string;
  answer: string;
  category?: string;
}

// 👉 GET: List FAQs with search and pagination
export const useFaqs = (params: GetFaqsParams) => {
  return useQuery({
    queryKey: ["faqs", params],
    queryFn: async () => {
      const response = await api.get("/admin/faqs", { params });
      return response.data;
    },
  });
};

// 👉 GET: Get single FAQ details
export const useFaqDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ["faq", id],
    queryFn: async () => {
      const response = await api.get(`/admin/faqs/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run if ID exists
  });
};

// 👉 POST: Create FAQ
export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateFaqPayload) => {
      const response = await api.post("/admin/faqs", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

// 👉 PATCH: Update FAQ
export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateFaqPayload> }) => {
      const response = await api.patch(`/admin/faqs/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faq", variables.id] });
    },
  });
};

// 👉 DELETE: Delete FAQ
export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/faqs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};