import { api } from "@/services/api";
import { useQuery, keepPreviousData, useQueryClient, useMutation } from "@tanstack/react-query";

// Define the exact parameters your API accepts based on your specs
 interface GetUsersParams {
  search?: string;
  status?: 'active' | 'inactive' | 'suspended';
  role?: string;
  businessType?: string;
  planType?: string;
  bankConnectionStatus?: 'connected' | 'disconnected' | 'not_connected';
  accountStatus?: 'active' | 'inactive' | 'suspended' | 'deleted';
  sortBy?: 'name' | 'createdAt' | 'plan' | 'banksLinked' | 'lastActive' | 'businessType' | 'accountStatus';
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
  page?: number;
  limit?: number;
}

 const fetchUsers = async (params: GetUsersParams) => {
  // Pass the params object directly to Axios
  const response = await api.get('/admin/users', { params });
  return response.data;
};




export const useUsers = (params: GetUsersParams) => {
  return useQuery({
    // The queryKey uniquely identifies this cache. 
    // Including params means it auto-refetches when any param changes.
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    // This keeps the old data on screen while fetching the next page, preventing UI flicker
    placeholderData: keepPreviousData, 
  });
};

export const fetchUser = async (id: string) => {
  const response = await api.get(`/admin/users/${id}`);
  // Assuming the API returns the user object directly, or inside a data/user property
  return response.data.user || response.data;
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id, // Only run if we actually have an ID
  });
};

// 👉 New: Update user mutation based on the Swagger spec
export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  businessName?: string;
  businessType?: string;
}

export const updateUser = async ({ id, data }: { id: string; data: UpdateUserPayload }) => {
  const response = await api.patch(`/admin/users/${id}`, data);
  return response.data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_, variables) => {
      // Invalidate both the single user cache and the list cache so the UI updates instantly
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// New: Update user status mutation (based on image_903bd8.png)
export const updateUserStatus = async ({ id, status }: { id: string; status: 'active' | 'inactive' | 'suspended' }) => {
  const response = await api.patch(`/admin/users/${id}/status`, { status });
  return response.data;
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (_, variables) => {
      // Refresh the lists and the specific user's details instantly
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};


export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/admin/users/${id}/reset-password`);
      return response.data;
    },
  });
};