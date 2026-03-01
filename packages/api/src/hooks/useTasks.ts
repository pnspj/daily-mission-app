import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost } from '../client'
import type { CreateTaskRequest, Task } from '../types'

export function useTasks(taskSetId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', taskSetId],
    queryFn: () => apiGet<Task[]>(`/api/v1/task-sets/${taskSetId}/tasks`),
    enabled: !!taskSetId,
  })
}

export function useCreateTask(taskSetId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskRequest) =>
      apiPost<Task>(`/api/v1/task-sets/${taskSetId}/tasks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskSetId] })
    },
  })
}
