import { createContext } from 'react'
import { JournalContextData } from './types'

export const JournalContext = createContext<JournalContextData>({} as JournalContextData)
