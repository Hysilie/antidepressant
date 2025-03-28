import { createContext } from 'react'
import { TaskContextData } from './types'

export const TaskContext = createContext<TaskContextData>({} as TaskContextData)
