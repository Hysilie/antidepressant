import { createContext } from 'react'
import { PlayerContextData } from './types'

export const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData)
