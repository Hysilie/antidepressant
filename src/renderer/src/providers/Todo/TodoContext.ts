import { createContext } from 'react'
import { TodosContextData } from './types'

export const TodosContext = createContext<TodosContextData>({} as TodosContextData)
