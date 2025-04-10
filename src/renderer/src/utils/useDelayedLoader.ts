import { useCallback, useRef } from 'react'

type DelayedLoadType = (
  setLoading: (bool: boolean) => void,
  delay?: number
) => UseDelayedLoaderReturn

export type UseDelayedLoaderReturn = {
  start: () => void
  stop: () => void
}

export const useDelayedLoader: DelayedLoadType = (
  setLoading,
  delay = 150
): UseDelayedLoaderReturn => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const start = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setLoading(true)
    }, delay)
  }, [delay, setLoading])

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setLoading(false)
  }, [setLoading])

  return { start, stop }
}
