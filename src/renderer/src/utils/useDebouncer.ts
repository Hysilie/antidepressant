import { useMemo } from 'react'
import { debounce } from 'lodash'

export const useDebouncer = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  action: T,
  delay = 300
): ((...args: Parameters<T>) => void) => {
  return useMemo(() => debounce(action, delay), [action, delay])
}
