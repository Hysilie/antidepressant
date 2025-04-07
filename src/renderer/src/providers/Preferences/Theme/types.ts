import { Dispatch, SetStateAction } from 'react'
import { Mode, Theme } from '../types'

export interface ThemeContextData {
  mode?: Mode
  setMode?: Dispatch<SetStateAction<Mode>>
  color: Theme
  setColor: (name: Theme) => void
}
