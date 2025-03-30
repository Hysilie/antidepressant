import { createContext } from 'react'
import { PreferencesDataContext } from './types'

export const PreferencesContext = createContext<PreferencesDataContext>(
  {} as PreferencesDataContext
)
