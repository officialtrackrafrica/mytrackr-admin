import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

interface GetTransactionsParams {
  page: number;
  limit?: number;
  search?: string;
}

export const fetchTransactions = async (params: GetTransactionsParams) => {
  const response = await api.get("/admin/transactions", { params });
  return response.data;
};

export const useTransactions = (params: GetTransactionsParams) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => fetchTransactions(params),
  });
};