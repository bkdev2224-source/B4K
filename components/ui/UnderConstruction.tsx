'use client'

import Link from 'next/link'

export type UnderConstructionVariant = 'default' | 'maintenance' | 'coming-soon' | 'testing'

export interface UnderConstructionProps {
  /** Main title */
  title?: string
  /** Description message */
  message?: string
  /** Variant style: 'default' | 'maintenance' | 'coming-soon' | 'testing' */
  variant?: UnderConstructionVariant
  /** Custom icon (optional) */
  icon?: React.ReactNode
  /** Additional content below the message */
  children?: React.ReactNode
  /** Container className */
  className?: string
  /** Show back button */
  showBackButton?: boolean
  /** Back button href (defaults to "/") */
  backHref?: string
  /** Back button label */
  backLabel?: string
}

const variantConfig: Record<UnderConstructionVariant, { 
  defaultTitle: string
  defaultMessage: string
  iconColor: string
  bgColor: string
  borderColor: string
  textColor: string
}> = {
  default: {
    defaultTitle: 'Under Construction',
    defaultMessage: 'This feature is currently being built. Please check back soon!',
    iconColor: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
    textColor: 'text-gray-900 dark:text-gray-100',
  },
  maintenance: {
    defaultTitle: 'Under Maintenance',
    defaultMessage: 'We\'re performing scheduled maintenance. We\'ll be back shortly!',
    iconColor: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
    textColor: 'text-gray-900 dark:text-gray-100',
  },
  'coming-soon': {
    defaultTitle: 'Coming Soon',
    defaultMessage: 'This feature is coming soon. Stay tuned!',
    iconColor: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
    textColor: 'text-gray-900 dark:text-gray-100',
  },
  testing: {
    defaultTitle: 'Temporarily Unavailable',
    defaultMessage: 'This feature is temporarily disabled for testing purposes.',
    iconColor: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
    textColor: 'text-gray-900 dark:text-gray-100',
  },
}

const DefaultIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

export function UnderConstruction({
  title,
  message,
  variant = 'default',
  icon,
  children,
  className = '',
  showBackButton = false,
  backHref = '/',
  backLabel = 'Go Back',
}: UnderConstructionProps) {
  const config = variantConfig[variant]
  const displayTitle = title ?? config.defaultTitle
  const displayMessage = message ?? config.defaultMessage

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 sm:p-8 ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`${config.iconColor} mb-4`}>
          {icon ?? <DefaultIcon className="w-12 h-12 sm:w-16 sm:h-16" />}
        </div>
        <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${config.textColor}`}>
          {displayTitle}
        </h2>
        <p className={`text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6`}>
          {displayMessage}
        </p>
        {showBackButton && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-800/70 transition-colors focus-ring"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {backLabel}
          </Link>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
