'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  useThemes,
  useTaskSets,
  useTasks,
  useCreateTaskSetRecord,
  useCreateTaskSet,
  useCreateTask,
  getI18nText,
} from '@daily-mission/api'
import type { TaskRecord, TaskSet } from '@daily-mission/api'
import { Button, PointBadge } from '@daily-mission/ui'
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

// ---- タスクセット追加フォーム ----
function AddTaskSetForm({
  themeId,
  onAdded,
  onCancel,
}: {
  themeId: string
  onAdded: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly' | 'adhoc'>('daily')
  const createTaskSet = useCreateTaskSet(themeId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createTaskSet.mutateAsync({
      name_i18n: { ja: name },
      type,
    })
    onAdded()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 space-y-3"
    >
      <p className="text-sm font-semibold text-indigo-800">タスクセットを追加</p>
      <input
        type="text"
        required
        placeholder="例：モーニングルーティン"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as typeof type)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="daily">毎日 (daily)</option>
        <option value="weekly">毎週 (weekly)</option>
        <option value="monthly">毎月 (monthly)</option>
        <option value="adhoc">随時 (adhoc)</option>
      </select>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          キャンセル
        </Button>
        <Button type="submit" loading={createTaskSet.isPending} className="flex-1">
          追加
        </Button>
      </div>
    </form>
  )
}

// ---- タスク追加フォーム ----
function AddTaskForm({
  taskSetId,
  onAdded,
  onCancel,
}: {
  taskSetId: string
  onAdded: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [point, setPoint] = useState(10)
  const createTask = useCreateTask(taskSetId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createTask.mutateAsync({
      name_i18n: { ja: name },
      point,
    })
    onAdded()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-green-200 bg-green-50 p-3 space-y-3"
    >
      <p className="text-xs font-semibold text-green-800">タスクを追加</p>
      <input
        type="text"
        required
        placeholder="例：水を2L飲む"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
          focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
      />
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600 whitespace-nowrap">ポイント:</label>
        <input
          type="number"
          required
          min={1}
          max={1000}
          value={point}
          onChange={(e) => setPoint(Number(e.target.value))}
          className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm
            focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1 text-xs">
          キャンセル
        </Button>
        <Button type="submit" loading={createTask.isPending} className="flex-1 text-xs">
          追加
        </Button>
      </div>
    </form>
  )
}

// ---- タスクセットセクション ----
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
  const [showAddTask, setShowAddTask] = useState(false)
  const name = getI18nText(taskSet.name_i18n)

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">{name}</h2>
          <span className="text-xs text-gray-400">{taskSet.type}</span>
        </div>
        {!showAddTask && (
          <button
            type="button"
            onClick={() => setShowAddTask(true)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            + タスクを追加
          </button>
        )}
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
        {!isLoading && tasks?.length === 0 && !showAddTask && (
          <p className="text-sm text-gray-400 py-2 px-1">
            タスクがありません。「+ タスクを追加」から追加してください。
          </p>
        )}
        {showAddTask && (
          <AddTaskForm
            taskSetId={taskSet.id}
            onAdded={() => setShowAddTask(false)}
            onCancel={() => setShowAddTask(false)}
          />
        )}
      </div>
    </div>
  )
}

// ---- メイン画面 ----
export function DailyCheckInScreen({ themeId, onBack }: DailyCheckInScreenProps) {
  const { data: themes } = useThemes()
  const { data: taskSets, isLoading: taskSetsLoading } = useTaskSets(themeId)
  const createRecord = useCreateTaskSetRecord()

  const [taskSetRecordsMap, setTaskSetRecordsMap] = useState<
    Record<string, TaskSetWithRecords>
  >({})
  const [pointAnimation, setPointAnimation] = useState<number | null>(null)
  const [showAddTaskSet, setShowAddTaskSet] = useState(false)

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

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-4">
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

        {/* タスクセットなし・空状態 */}
        {!taskSetsLoading && taskSets?.length === 0 && !showAddTaskSet && (
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <div className="text-6xl">📋</div>
            <h2 className="text-lg font-bold text-gray-800">タスクセットがありません</h2>
            <p className="text-sm text-gray-500">
              ミッションのグループ（タスクセット）を作成してください。
            </p>
            <Button onClick={() => setShowAddTaskSet(true)}>
              タスクセットを追加
            </Button>
          </div>
        )}

        {/* タスクセット追加フォーム */}
        {showAddTaskSet && (
          <AddTaskSetForm
            themeId={themeId}
            onAdded={() => setShowAddTaskSet(false)}
            onCancel={() => setShowAddTaskSet(false)}
          />
        )}

        {/* タスクセットが存在する場合のフッターボタン */}
        {!taskSetsLoading && taskSets && taskSets.length > 0 && !showAddTaskSet && (
          <button
            type="button"
            onClick={() => setShowAddTaskSet(true)}
            className="w-full rounded-xl border-2 border-dashed border-gray-200 py-3
              text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
          >
            + タスクセットを追加
          </button>
        )}
      </main>
    </div>
  )
}
