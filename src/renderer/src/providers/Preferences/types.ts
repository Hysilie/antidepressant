import { Dispatch } from 'react'

export type Mode = 'light' | 'dark' | 'system'
export type Theme =
  | 'Honey Glimmer'
  | 'Lavender Fizz'
  | 'Minty Splash'
  | 'Candyfloss Bloom'
  | 'Icy Breeze'
  | 'Tangerine Zing'
  | 'Butterscotch Cream'
  | 'Blueberry Dive'

export interface PreferencesStates {
  mode: Mode
  theme: Theme
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
