import { useContext } from 'react'
import { isEmpty } from 'remeda'
import { TodosContextData } from './types'
import { TodosContext } from './TodoContext'

export const useTodo = (): TodosContextData => {
  const context = useContext(TodosContext)

  if (isEmpty(context)) {
    throw new Error('useTodo must be used within an TodoProvider')
  }
  return context
}
