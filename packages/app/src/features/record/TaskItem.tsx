'use client'

import React, { useState } from 'react'
import type { Task, TaskRecord } from '@daily-mission/api'
import { getI18nText, useAchieveTaskRecord } from '@daily-mission/api'

interface TaskItemProps {
  task: Task
  taskRecord: TaskRecord | undefined
  /** ポイント加算アニメーション完了後に呼ぶコールバック */
  onAchieved?: (earnedPoint: number) => void
}

export function TaskItem({ task, taskRecord, onAchieved }: TaskItemProps) {
  const achieveMutation = useAchieveTaskRecord()
  const [showAnimation, setShowAnimation] = useState(false)
  const achieved = taskRecord?.achieved ?? false

  const handleCheck = async () => {
    if (achieved || !taskRecord || achieveMutation.isPending) return

    try {
      await achieveMutation.mutateAsync(taskRecord.id)
      setShowAnimation(true)
      onAchieved?.(task.point)
      setTimeout(() => setShowAnimation(false), 1500)
    } catch {
      // エラーは上位コンポーネントで表示しない（楽観的UIは使わない）
    }
  }

  const name = getI18nText(task.name_i18n)

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200
        ${achieved ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-white hover:border-indigo-100 hover:bg-indigo-50/30'}`}
    >
      {/* チェックボックス */}
      <button
        type="button"
        onClick={handleCheck}
        disabled={achieved || achieveMutation.isPending}
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
          ${achieved
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-gray-300 hover:border-indigo-400'
          } disabled:cursor-default`}
        aria-label={achieved ? '達成済み' : 'タスクを達成する'}
      >
        {achieved && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {achieveMutation.isPending && !achieved && (
          <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
      </button>

      {/* タスク名 */}
      <div className="min-w-0 flex-1">
        <span
          className={`text-sm font-medium ${achieved ? 'text-gray-400 line-through' : 'text-gray-800'}`}
        >
          {name}
        </span>
      </div>

      {/* ポイント + アニメーション */}
      <div className="relative flex-shrink-0">
        <span className={`text-sm font-semibold ${achieved ? 'text-green-600' : 'text-indigo-600'}`}>
          +{task.point} pt
        </span>
        {showAnimation && (
          <span
            className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce
              text-sm font-bold text-yellow-500"
          >
            +{task.point}⭐
          </span>
        )}
      </div>
    </div>
  )
}
