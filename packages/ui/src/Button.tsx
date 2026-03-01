import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  disabled?: boolean
  loading?: boolean
  className?: string
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300',
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  ghost: 'text-gray-600 hover:bg-gray-100 disabled:text-gray-400',
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium
        transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          処理中...
        </>
      ) : (
        children
      )}
    </button>
  )
}
