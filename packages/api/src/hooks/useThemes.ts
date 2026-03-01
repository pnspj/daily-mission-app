import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost } from '../client'
import type { CreateThemeRequest, Theme } from '../types'

export function useThemes() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: () => apiGet<Theme[]>('/api/v1/themes'),
  })
}

export function useCreateTheme() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateThemeRequest) =>
      apiPost<Theme>('/api/v1/themes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] })
    },
  })
}
