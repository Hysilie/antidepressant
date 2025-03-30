import { FC, PropsWithChildren } from 'react'
import { PreferencesContext } from './PreferencesContext'

export const PreferencesProvider: FC<PropsWithChildren> = ({ children }) => {
  const deleteAccount = (): void => console.log('Delete Account')
  return (
    <PreferencesContext.Provider value={{ deleteAccount }}>{children}</PreferencesContext.Provider>
  )
}
