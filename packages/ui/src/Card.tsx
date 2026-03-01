import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  const base =
    'bg-white rounded-xl border border-gray-100 shadow-sm p-4 transition-shadow hover:shadow-md'
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left ${base} cursor-pointer ${className}`}
      >
        {children}
      </button>
    )
  }
  return <div className={`${base} ${className}`}>{children}</div>
}
