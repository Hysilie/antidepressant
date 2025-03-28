import { useContext } from 'react'
import { isEmpty } from 'remeda'
import { TaskContextData } from './types'
import { TaskContext } from './TaskContext'

export const useTask = (): TaskContextData => {
  const context = useContext(TaskContext)

  if (isEmpty(context)) {
    throw new Error('useTask must be used within an TaskProvider')
  }
  return context
}
