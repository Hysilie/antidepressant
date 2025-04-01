import { Dispatch } from 'react'

export interface PreferencesStates {
  theme: 'light' | 'dark' | 'system'
  musicAutoplay: boolean
  lockScreenEnabled: boolean
}

export type PreferenceActionName = 'set' | 'switch' | 'reset' | 'get'
export interface PreferencesAction {
  type: PreferenceActionName
  key?: keyof PreferencesStates
  value?: unknown
  storage?: Partial<PreferencesStates>
}

export interface PreferencesDataContext {
  preferencesStates: PreferencesStates
  resetAllPreferences: () => void
  dispatchPreferences: Dispatch<PreferencesAction>
}
