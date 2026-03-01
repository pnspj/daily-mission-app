import React from 'react'
import type { Theme } from '@daily-mission/api'
import { Card } from './Card'
import { PointBadge } from './PointBadge'

interface ThemeCardProps {
  theme: Theme
  onClick?: () => void
}

export function ThemeCard({ theme, onClick }: ThemeCardProps) {
  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-gray-900">
            {theme.name}
          </h3>
          {theme.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {theme.description}
            </p>
          )}
        </div>
        <PointBadge current={theme.current_point} total={theme.total_earned_point} />
      </div>
    </Card>
  )
}
