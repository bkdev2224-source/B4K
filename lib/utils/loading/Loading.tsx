"use client"

type LoadingProps = {
  label?: string
  className?: string
  spinnerClassName?: string
}

/**
 * 어디서든 재사용 가능한 공용 로딩 컴포넌트
 * - 기본은 인라인(컨텐츠 안에서 사용)
 * - 전체 화면 로딩이 필요하면 `LoadingScreen` 사용
 */
export function Loading({ label = 'Loading...', className = '', spinnerClassName = '' }: LoadingProps) {
  return (
    <div
      className={[
        'inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200',
        className,
      ].join(' ')}
    >
      <span
        className={[
          'w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin',
          spinnerClassName,
        ].join(' ')}
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export function LoadingScreen(props: LoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loading {...props} />
      </div>
    </div>
  )
}


