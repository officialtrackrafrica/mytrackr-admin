import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export interface SubscriptionHistoryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const useSubscriptionHistory = (params?: SubscriptionHistoryParams) => {
  return useQuery({
    queryKey: ['subscription-history', params],
    queryFn: async () => {
      // Clean params to remove undefined/null/empty strings before sending
      const cleanParams = params 
        ? Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
          )
        : {};

      const { data } = await api.get('/admin/subscriptions/history', { params: cleanParams });
      return data;
    },
  });
};