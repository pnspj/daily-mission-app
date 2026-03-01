import React from 'react'

interface PointBadgeProps {
  current: number
  total?: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

export function PointBadge({ current, total, size = 'md' }: PointBadgeProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-indigo-100 font-semibold text-indigo-700 ${sizeClasses[size]}`}
      >
        <span>⭐</span>
        <span>{current.toLocaleString()} pt</span>
      </span>
      {total !== undefined && total > 0 && (
        <span className="text-xs text-gray-400">
          累計 {total.toLocaleString()} pt
        </span>
      )}
    </div>
  )
}
