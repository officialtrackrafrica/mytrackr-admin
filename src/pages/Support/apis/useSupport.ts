import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface GetTicketsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

//  GET: List support tickets
export const useTickets = (params: GetTicketsParams) => {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: async () => {
      const response = await api.get("/admin/support/tickets", { params });
      return response.data;
    },
  });
};

//  GET: Get support ticket status counts
export const useTicketStats = () => {
  return useQuery({
    queryKey: ["ticket-stats"],
    queryFn: async () => {
      const response = await api.get("/admin/support/tickets/stats");
      return response.data;
    },
  });
};

//  GET: Get support ticket details and replies
export const useTicketDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ["ticket-details", id],
    queryFn: async () => {
      const response = await api.get(`/admin/support/tickets/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

//  PATCH: Update support ticket status
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/admin/support/tickets/${id}`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket-stats"] });
      queryClient.invalidateQueries({ queryKey: ["ticket-details", variables.id] });
    },
  });
};

//  POST: Reply to a client support ticket
export const useReplyToTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, message, attachments }: { id: string; message: string; attachments?: any[] }) => {
      const response = await api.post(`/admin/support/tickets/${id}/replies`, { message, attachments });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-details", variables.id] });
    },
  });
};