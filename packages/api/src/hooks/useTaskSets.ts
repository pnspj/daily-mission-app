import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost } from '../client'
import type { CreateTaskSetRequest, TaskSet } from '../types'

export function useTaskSets(themeId: string | undefined) {
  return useQuery({
    queryKey: ['task-sets', themeId],
    queryFn: () => apiGet<TaskSet[]>(`/api/v1/themes/${themeId}/task-sets`),
    enabled: !!themeId,
  })
}

export function useCreateTaskSet(themeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskSetRequest) =>
      apiPost<TaskSet>(`/api/v1/themes/${themeId}/task-sets`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-sets', themeId] })
    },
  })
}
