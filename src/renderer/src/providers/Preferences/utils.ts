import { PreferencesStates } from './types'

export const defaultPreferencesState: PreferencesStates = {
  theme: 'light',
  musicAutoplay: false,
  lockScreenEnabled: false
}

export function isPreferencesStates(obj: unknown): obj is PreferencesStates {
  if (typeof obj !== 'object' || obj === null) return false

  const preferences = obj as Partial<PreferencesStates>

  const validThemes = ['light', 'dark', 'system']

  return (
    typeof preferences.theme === 'string' &&
    validThemes.includes(preferences.theme) &&
    typeof preferences.musicAutoplay === 'boolean' &&
    (preferences.lockScreenEnabled === undefined ||
      typeof preferences.lockScreenEnabled === 'boolean')
  )
}
