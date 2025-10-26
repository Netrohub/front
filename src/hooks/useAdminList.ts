import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface UseAdminListOptions<T> {
  endpoint: string;
  initialSearchTerm?: string;
  pageSize?: number;
  queryKey?: string[];
}

interface UseAdminListReturn<T> {
  data: T[];
  isLoading: boolean;
  isProcessing: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setPagination: (pagination: Partial<typeof pagination>) => void;
  refetch: () => Promise<void>;
  updateItem: (id: number, data: Partial<T>) => void;
  deleteItem: (id: number) => void;
}

export function useAdminList<T extends { id: number }>({
  endpoint,
  initialSearchTerm = '',
  pageSize = 25,
  queryKey,
}: UseAdminListOptions<T>): UseAdminListReturn<T> {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 0,
  });

  // Generate query key for React Query cache
  const generatedQueryKey = queryKey || ['admin-list', endpoint];
  
  // Use React Query for data fetching with caching
  const { data: queryData, isLoading, refetch: queryRefetch } = useQuery({
    queryKey: [...generatedQueryKey, pagination.page, pagination.limit, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await apiClient.request<any>(`/admin${endpoint}?${params}`);
      
      // Handle both array and wrapped responses
      let items: T[] = [];
      let paginationData = {
        total: 0,
        totalPages: 0,
      };

      if (Array.isArray(response)) {
        items = response;
        paginationData = {
          total: response.length,
          totalPages: Math.ceil(response.length / pagination.limit),
        };
      } else if (response.data) {
        items = response.data;
        if (response.pagination) {
          paginationData = {
            total: response.pagination.total || 0,
            totalPages: response.pagination.total_pages || 0,
          };
        }
      }

      return {
        items,
        pagination: paginationData,
      };
    },
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s
    gcTime: 5 * 60 * 1000, // 5 minutes - cache for 5 minutes
    retry: 1,
    onError: (error: any) => {
      console.error(`Failed to fetch ${endpoint}:`, error);
      toast.error('Failed to load data', {
        description: error.message || 'An error occurred while loading data',
      });
    },
  });

  const data = queryData?.items || [];
  
  // Merge pagination from query data with local state - memoized to prevent re-renders
  const paginationState = useMemo(() => ({
    page: pagination.page,
    limit: pagination.limit,
    total: queryData?.pagination?.total ?? pagination.total,
    totalPages: queryData?.pagination?.totalPages ?? pagination.totalPages,
  }), [pagination.page, pagination.limit, pagination.total, pagination.totalPages, queryData?.pagination?.total, queryData?.pagination?.totalPages]);

  // Optimistic update for item update
  const updateItem = useCallback((id: number, updates: Partial<T>) => {
    setIsProcessing(true);
    
    const queryKey = [...generatedQueryKey, pagination.page, pagination.limit, searchTerm];
    
    // Optimistically update the cache
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        items: oldData.items.map((item: T) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      };
    });
    
    setIsProcessing(false);
  }, [queryClient, generatedQueryKey, pagination.page, pagination.limit, searchTerm]);

  // Optimistic update for item delete
  const deleteItem = useCallback((id: number) => {
    setIsProcessing(true);
    
    const queryKey = [...generatedQueryKey, pagination.page, pagination.limit, searchTerm];
    
    // Optimistically update the cache
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        items: oldData.items.filter((item: T) => item.id !== id),
      };
    });
    
    setIsProcessing(false);
  }, [queryClient, generatedQueryKey, pagination.page, pagination.limit, searchTerm]);

  const refetch = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  return {
    data,
    isLoading,
    isProcessing,
    searchTerm,
    setSearchTerm,
    pagination: paginationState,
    setPagination: (updates: Partial<typeof pagination>) => {
      setPagination(prev => ({ ...prev, ...updates }));
    },
    refetch,
    updateItem,
    deleteItem,
  };
}
