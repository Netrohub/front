import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

interface UseAdminMutationOptions<T> {
  endpoint: string;
  onSuccess?: (data?: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseAdminMutationReturn<T> {
  mutate: (data: Partial<T> | T) => Promise<void>;
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
}: UseAdminMutationOptions<T>): UseAdminMutationReturn<T> {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: Partial<T> | T) => {
    try {
      setIsMutating(true);
      setError(null);
      const response = await apiClient.request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
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
  }, [endpoint, successMessage, errorMessage, onSuccess, onError]);

  const update = useCallback(async (id: number, data: Partial<T>) => {
    try {
      setIsMutating(true);
      setError(null);
      const response = await apiClient.request<T>(`${endpoint}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      
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
  }, [endpoint, onSuccess, onError]);

  const remove = useCallback(async (id: number) => {
    try {
      setIsMutating(true);
      setError(null);
      await apiClient.request(`${endpoint}/${id}`, {
        method: 'DELETE',
      });
      
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
  }, [endpoint, onSuccess, onError]);

  return {
    mutate,
    update,
    remove,
    isMutating,
    error,
  };
}
