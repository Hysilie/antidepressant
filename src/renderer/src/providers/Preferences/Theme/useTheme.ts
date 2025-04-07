import { isEmpty } from 'remeda'
import { ThemeContextData } from './types'
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

export const useTheme = (): ThemeContextData => {
  const context = useContext(ThemeContext)

  if (isEmpty(context)) {
    throw new Error('useTeme must be used within a Theme Provider')
  }
  return context
}
