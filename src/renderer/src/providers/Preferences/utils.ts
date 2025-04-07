import { PreferencesStates } from './types'

export const defaultPreferencesState: PreferencesStates = {
  mode: 'light',
  theme: 'Butterscotch Cream',
  musicAutoplay: false,
  lockScreenEnabled: false
}

export function isPreferencesStates(obj: unknown): obj is PreferencesStates {
  if (typeof obj !== 'object' || obj === null) return false

  const preferences = obj as Partial<PreferencesStates>

  const validMode = ['light', 'dark', 'system']

  return (
    typeof preferences.mode === 'string' &&
    validMode.includes(preferences.mode) &&
    typeof preferences?.musicAutoplay === 'boolean' &&
    (preferences?.lockScreenEnabled === undefined ||
      typeof preferences?.lockScreenEnabled === 'boolean')
  )
}
