import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export function useApiGet<T>(
  key: string[],
  endpoint: string,
  enabled = true,
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => api.get<T>(endpoint),
    enabled,
  })
}

export function useApiPost<T, B = unknown>(
  key: string[],
  endpoint: string,
) {
  const queryClient = useQueryClient()

  return useMutation<T, Error, B>({
    mutationFn: (body: B) => api.post<T>(endpoint, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
  })
}

export function useApiPut<T, B = unknown>(
  key: string[],
  endpoint: string,
) {
  const queryClient = useQueryClient()

  return useMutation<T, Error, B>({
    mutationFn: (body: B) => api.put<T>(endpoint, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
  })
}

export function useApiDelete<T>(
  key: string[],
  endpoint: string,
) {
  const queryClient = useQueryClient()

  return useMutation<T, Error, void>({
    mutationFn: () => api.delete<T>(endpoint),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
