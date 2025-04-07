import { Dispatch, SetStateAction } from 'react'
import { Mode, Theme } from '../types'

export interface ThemeContextData {
  mode?: Mode
  setMode?: Dispatch<SetStateAction<Mode>>
  color: Theme
  hex: string
  setColor: (name: Theme) => void
}
