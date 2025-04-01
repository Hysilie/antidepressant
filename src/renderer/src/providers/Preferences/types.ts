import { Dispatch } from 'react'

export interface PreferencesStates {
  theme: 'light' | 'dark' | 'system'
  musicAutoplay: boolean
  lockCode?: number
}

export type PreferenceActionName = 'set' | 'switch' | 'reset' | 'get'
export interface PreferencesAction {
  type: PreferenceActionName
  key?: keyof PreferencesStates
  value?: unknown
  storage?: Partial<PreferencesStates>
}

export interface PreferencesDataContext {
  deleteAccount: () => void
  preferencesStates: PreferencesStates
  resetAllPreferences: () => void
  dispatchPreferences: Dispatch<PreferencesAction>
}
