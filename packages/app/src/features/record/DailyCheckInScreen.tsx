'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  useThemes,
  useTaskSets,
  useTasks,
  useCreateTaskSetRecord,
  getI18nText,
} from '@daily-mission/api'
import type { TaskRecord, TaskSet } from '@daily-mission/api'
import { PointBadge } from '@daily-mission/ui'
import { TaskItem } from './TaskItem'

interface DailyCheckInScreenProps {
  themeId: string
  onBack: () => void
}

/** ローカル日付を YYYY-MM-DD 形式で返す */
function todayLocalDate(): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .replace(/\//g, '-')
}

interface TaskSetWithRecords {
  taskSet: TaskSet
  taskRecords: TaskRecord[]
}

export function DailyCheckInScreen({ themeId, onBack }: DailyCheckInScreenProps) {
  const { data: themes } = useThemes()
  const { data: taskSets, isLoading: taskSetsLoading } = useTaskSets(themeId)
  const createRecord = useCreateTaskSetRecord()

  // タスクセットごとのタスクレコードを保持
  const [taskSetRecordsMap, setTaskSetRecordsMap] = useState<
    Record<string, TaskSetWithRecords>
  >({})
  const [pointAnimation, setPointAnimation] = useState<number | null>(null)

  const theme = themes?.find((t) => t.id === themeId)
  const today = useMemo(() => todayLocalDate(), [])

  // タスクセットが読み込まれたら全て POST /task-set-records（冪等）
  useEffect(() => {
    if (!taskSets || taskSets.length === 0) return

    const run = async () => {
      const results: Record<string, TaskSetWithRecords> = {}
      await Promise.all(
        taskSets.map(async (taskSet) => {
          try {
            const { task_records } = await createRecord.mutateAsync({
              task_set_id: taskSet.id,
              target_date: today,
            })
            results[taskSet.id] = { taskSet, taskRecords: task_records }
          } catch {
            results[taskSet.id] = { taskSet, taskRecords: [] }
          }
        }),
      )
      setTaskSetRecordsMap(results)
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskSets?.map((ts) => ts.id).join(','), today])

  const handleAchieved = (point: number) => {
    setPointAnimation(point)
    setTimeout(() => setPointAnimation(null), 1500)
  }

  const totalTaskCount = Object.values(taskSetRecordsMap).reduce(
    (sum, { taskRecords }) => sum + taskRecords.length,
    0,
  )
  const achievedCount = Object.values(taskSetRecordsMap).reduce(
    (sum, { taskRecords }) => sum + taskRecords.filter((r) => r.achieved).length,
    0,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="戻る"
          >
            ← 戻る
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-gray-900">
              {theme?.name ?? '読み込み中...'}
            </h1>
            <p className="text-xs text-gray-500">{today}</p>
          </div>
          {theme && (
            <div className="relative">
              <PointBadge
                current={theme.current_point}
                total={theme.total_earned_point}
              />
              {pointAnimation !== null && (
                <span className="absolute -top-6 right-0 animate-bounce text-sm font-bold text-yellow-500">
                  +{pointAnimation}⭐
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* 進捗バー */}
        {totalTaskCount > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">今日の進捗</span>
              <span className="text-sm font-bold text-indigo-600">
                {achievedCount} / {totalTaskCount}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{
                  width: `${totalTaskCount > 0 ? (achievedCount / totalTaskCount) * 100 : 0}%`,
                }}
              />
            </div>
            {achievedCount === totalTaskCount && totalTaskCount > 0 && (
              <p className="mt-2 text-center text-sm font-medium text-green-600">
                🎉 全タスク完了！素晴らしい！
              </p>
            )}
          </div>
        )}

        {taskSetsLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        )}

        {Object.values(taskSetRecordsMap).map(({ taskSet, taskRecords }) => (
          <TaskSetSection
            key={taskSet.id}
            taskSet={taskSet}
            taskRecords={taskRecords}
            onAchieved={handleAchieved}
          />
        ))}

        {!taskSetsLoading && taskSets?.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <div className="text-6xl">📋</div>
            <h2 className="text-lg font-bold text-gray-800">タスクセットがありません</h2>
            <p className="text-sm text-gray-500">
              このテーマにタスクセットを追加してください。
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// タスクセットごとのセクションコンポーネント
function TaskSetSection({
  taskSet,
  taskRecords,
  onAchieved,
}: {
  taskSet: TaskSet
  taskRecords: TaskRecord[]
  onAchieved: (point: number) => void
}) {
  const { data: tasks, isLoading } = useTasks(taskSet.id)
  const name = getI18nText(taskSet.name_i18n)

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-700">{name}</h2>
        <span className="text-xs text-gray-400">{taskSet.type}</span>
      </div>

      <div className="p-3 space-y-2">
        {isLoading && (
          <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
        )}
        {tasks?.map((task) => {
          const taskRecord = taskRecords.find((r) => r.task_id === task.id)
          return (
            <TaskItem
              key={task.id}
              task={task}
              taskRecord={taskRecord}
              onAchieved={onAchieved}
            />
          )
        })}
        {!isLoading && tasks?.length === 0 && (
          <p className="text-sm text-gray-400 py-2 px-4">タスクがありません</p>
        )}
      </div>
    </div>
  )
}
