import { createContext } from 'react'
import { LockDataContext } from './types'

export const LockContext = createContext<LockDataContext>({} as LockDataContext)
