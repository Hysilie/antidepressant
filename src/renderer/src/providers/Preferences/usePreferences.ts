import { useContext } from 'react'
import { isEmpty } from 'remeda'
import { PreferencesDataContext } from './types'
import { PreferencesContext } from './PreferencesContext'

export const usePreferences = (): PreferencesDataContext => {
  const context = useContext(PreferencesContext)

  if (isEmpty(context)) {
    throw new Error('usePreferences must be used within a Preferences Provider')
  }
  return context
}
