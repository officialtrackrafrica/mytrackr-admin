import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
// 👉 Updated to match image_0458e6.png
export interface ComposeMessagePayload {
  channel: 'email' | 'push';
  recipientGroup: 'all_users' | 'active_users' | 'inactive_users' | 'subscribers' | 'custom' | string;
  recipients?: string[];
  subject: string;
  body: string;
  templateId?: string;
  saveAsTemplate?: boolean;
  templateName?: string;
  metadata?: Record<string, any>;
}
export interface GetMessagesParams {
  channel?: 'email' | 'push';
  status?: 'sent' | 'draft' | 'trash' | 'failed';
  search?: string;
  page?: number;
  limit?: number;
}
// 👉 GET: List all messages (emails, push, drafts, trash)
export const useMessages = (params: GetMessagesParams) => {
  return useQuery({
    queryKey: ["messages", params],
    queryFn: async () => {
      const response = await api.get("/admin/messages", { params });
      return response.data;
    },
  });
};

// 👉 GET: Single message details (assuming endpoint exists, or fetching from list cache)
export const useMessageDetails = (id: string) => {
  return useQuery({
    queryKey: ["message", id],
    queryFn: async () => {
      const response = await api.get(`/admin/messages/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// 👉 POST: Compose and send message
export const useComposeMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ComposeMessagePayload) => {
      const response = await api.post("/admin/messages/compose", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

// 👉 POST/PATCH: Drafts
export const useSaveDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<ComposeMessagePayload> & { id?: string }) => {
      if (data.id) {
        const response = await api.patch(`/admin/messages/drafts/${data.id}`, data);
        return response.data;
      }
      const response = await api.post("/admin/messages/drafts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

// 👉 PATCH: Move to trash
export const useTrashMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/admin/messages/${id}/trash`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};


export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/messages/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });
};

export const useBulkDeleteMessages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Axios requires the body of a DELETE request to be passed in the `data` config property
      const { data } = await api.delete(`/admin/messages/bulk`, { data: { ids } });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });
};

// Optional: If you handle edits via a modal or form submission
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; [key: string]: any }) => {
      const { data } = await api.patch(`/admin/messages/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });
};