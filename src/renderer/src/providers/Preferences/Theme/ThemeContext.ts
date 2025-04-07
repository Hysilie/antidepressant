import { createContext } from 'react'
import { ThemeContextData } from './types'

export const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData)
