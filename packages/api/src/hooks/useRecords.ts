import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPatch, apiPost } from '../client'
import type {
  CreateTaskSetRecordRequest,
  TaskRecord,
  TaskSetRecordWithTasks,
} from '../types'

export function useCreateTaskSetRecord() {
  return useMutation({
    mutationFn: (data: CreateTaskSetRecordRequest) =>
      apiPost<TaskSetRecordWithTasks>('/api/v1/task-set-records', data),
  })
}

export function useAchieveTaskRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskRecordId: string) =>
      apiPatch<TaskRecord>(`/api/v1/task-records/${taskRecordId}/achieve`),
    onSuccess: () => {
      // ポイントが更新されるのでテーマ一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['themes'] })
    },
  })
}
