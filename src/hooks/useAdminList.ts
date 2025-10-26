import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

interface UseAdminListOptions<T> {
  endpoint: string;
  initialSearchTerm?: string;
  pageSize?: number;
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
}: UseAdminListOptions<T>): UseAdminListReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await apiClient.request<any>(`${endpoint}?${params}`);
      
      // Handle both array and wrapped responses
      if (Array.isArray(response)) {
        setData(response);
        setPagination(prev => ({
          ...prev,
          total: response.length,
          totalPages: Math.ceil(response.length / pagination.limit),
        }));
      } else if (response.data) {
        setData(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setData([]);
      }
    } catch (error: any) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      toast.error('Failed to load data', {
        description: error.message || 'An error occurred while loading data',
      });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, pagination.page, pagination.limit, searchTerm]);

  const updateItem = useCallback((id: number, updates: Partial<T>) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const deleteItem = useCallback((id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isProcessing,
    searchTerm,
    setSearchTerm,
    pagination,
    setPagination: (updates: Partial<typeof pagination>) => {
      setPagination(prev => ({ ...prev, ...updates }));
    },
    refetch: fetchData,
    updateItem,
    deleteItem,
  };
}
