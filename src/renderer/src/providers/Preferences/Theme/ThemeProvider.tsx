import { FC, PropsWithChildren, useEffect, useMemo } from 'react'
import { ThemeContext } from './ThemeContext'
import { colorOptions } from './colors'
import { usePreferences } from '../usePreferences'
import { Theme } from '../types'

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { preferencesStates, dispatchPreferences } = usePreferences()

  const { hex, name } = useMemo(() => {
    const selectedColor =
      colorOptions.find((c) => c.name === preferencesStates.theme) ?? colorOptions[0]
    return { hex: selectedColor.hex, name: selectedColor.name }
  }, [preferencesStates.theme])

  const setColor = (name: string): void => {
    dispatchPreferences({ type: 'set', key: 'theme', value: name })
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', hex)
  }, [hex])

  return (
    <ThemeContext.Provider value={{ color: name as Theme, hex, setColor }}>
      {children}
    </ThemeContext.Provider>
  )
}
