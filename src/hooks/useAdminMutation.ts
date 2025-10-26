import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { rateLimitApiCall } from '@/lib/rateLimiter';
import { sanitizeObject } from '@/lib/sanitize';

interface UseAdminMutationOptions<T> {
  endpoint: string;
  onSuccess?: (data?: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: string[]; // Query keys to invalidate after mutation
}

interface UseAdminMutationReturn<T> {
  mutate: (data: Partial<T> | T) => Promise<void>;
  create: (data: Partial<T> | T) => Promise<void>;
  update: (id: number, data: Partial<T>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  isMutating: boolean;
  error: Error | null;
}

export function useAdminMutation<T extends { id: number }>({
  endpoint,
  onSuccess,
  onError,
  successMessage = 'Operation completed successfully',
  errorMessage = 'Operation failed',
  invalidateQueries = ['admin-list'],
}: UseAdminMutationOptions<T>): UseAdminMutationReturn<T> {
  const queryClient = useQueryClient();
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: Partial<T> | T) => {
    try {
      setIsMutating(true);
      setError(null);
      
      // Sanitize input data
      const sanitizedData = sanitizeObject(data as Record<string, any>) as T;
      
      // Rate limit the API call
      const response = await rateLimitApiCall(
        () => apiClient.request<T>(endpoint, {
          method: 'POST',
          body: JSON.stringify(sanitizedData),
        }),
        'write'
      );
      
      // Invalidate related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: invalidateQueries });
      
      toast.success(successMessage);
      onSuccess?.(response);
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(errorMessage);
      setError(error);
      toast.error(errorMessage, {
        description: err.message || error.message,
      });
      onError?.(error);
      throw error;
    } finally {
      setIsMutating(false);
    }
  }, [endpoint, successMessage, errorMessage, onSuccess, onError, queryClient, invalidateQueries]);

  const update = useCallback(async (id: number, data: Partial<T>) => {
    try {
      setIsMutating(true);
      setError(null);
      
      // Sanitize input data
      const sanitizedData = sanitizeObject(data as Record<string, any>) as T;
      
      // Rate limit the API call
      const response = await rateLimitApiCall(
        () => apiClient.request<T>(`${endpoint}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(sanitizedData),
        }),
        'write'
      );
      
      // Invalidate related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: invalidateQueries });
      
      toast.success('Updated successfully');
      onSuccess?.(response);
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Update failed');
      setError(error);
      toast.error('Update failed', {
        description: err.message || error.message,
      });
      onError?.(error);
      throw error;
    } finally {
      setIsMutating(false);
    }
  }, [endpoint, onSuccess, onError, queryClient, invalidateQueries]);

  const remove = useCallback(async (id: number) => {
    try {
      setIsMutating(true);
      setError(null);
      
      // Rate limit the API call
      await rateLimitApiCall(
        () => apiClient.request(`${endpoint}/${id}`, {
          method: 'DELETE',
        }),
        'write'
      );
      
      // Invalidate related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: invalidateQueries });
      
      toast.success('Deleted successfully');
      onSuccess?.();
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Delete failed');
      setError(error);
      toast.error('Delete failed', {
        description: err.message || error.message,
      });
      onError?.(error);
      throw error;
    } finally {
      setIsMutating(false);
    }
  }, [endpoint, onSuccess, onError, queryClient, invalidateQueries]);

  return {
    mutate,
    update,
    remove,
    isMutating,
    error,
  };
}
