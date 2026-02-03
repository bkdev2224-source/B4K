'use client'

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
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-500 dark:border-yellow-400',
    textColor: 'text-yellow-800 dark:text-yellow-300',
  },
  maintenance: {
    defaultTitle: 'Under Maintenance',
    defaultMessage: 'We\'re performing scheduled maintenance. We\'ll be back shortly!',
    iconColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-500 dark:border-blue-400',
    textColor: 'text-blue-800 dark:text-blue-300',
  },
  'coming-soon': {
    defaultTitle: 'Coming Soon',
    defaultMessage: 'This feature is coming soon. Stay tuned!',
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-500 dark:border-purple-400',
    textColor: 'text-purple-800 dark:text-purple-300',
  },
  testing: {
    defaultTitle: 'Temporarily Unavailable',
    defaultMessage: 'This feature is temporarily disabled for testing purposes.',
    iconColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-500 dark:border-orange-400',
    textColor: 'text-orange-800 dark:text-orange-300',
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
}: UnderConstructionProps) {
  const config = variantConfig[variant]
  const displayTitle = title ?? config.defaultTitle
  const displayMessage = message ?? config.defaultMessage

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-6 sm:p-8 ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`${config.iconColor} mb-4`}>
          {icon ?? <DefaultIcon className="w-12 h-12 sm:w-16 sm:h-16" />}
        </div>
        <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${config.textColor}`}>
          {displayTitle}
        </h2>
        <p className={`text-sm sm:text-base ${config.textColor} mb-4`}>
          {displayMessage}
        </p>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  )
}
