import { useAuth } from '@clerk/clerk-react';
import { useCallback } from 'react';
import { apiClient } from '@/lib/api';

export function useApiClient() {
  const { getToken } = useAuth();

  // callApi(endpoint, options) always attaches latest Clerk token
  const callApi = useCallback(<T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    return getToken().then(token => apiClient.request<T>(endpoint, options, token));
  }, [getToken]);
  return { callApi };
}
