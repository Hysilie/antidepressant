import { TodoList } from '@renderer/providers/Todo/types'
import { SortOption } from './TodoScreen'
import { JSDOM } from 'jsdom'

export const sortTodos = (todoList: TodoList[], sortBy: SortOption): TodoList[] => {
  const getTimestampInSeconds = (value: { seconds: number } | Date | null | undefined): number => {
    if (!value) return 0
    if ('seconds' in value) return value.seconds
    if (value instanceof Date) return Math.floor(value.getTime() / 1000)
    return 0
  }

  return [...todoList].sort((a, b) => {
    const docA = new DOMParser().parseFromString(a.todos, 'text/html')
    const docB = new DOMParser().parseFromString(b.todos, 'text/html')

    const itemsA = [...docA.querySelectorAll('[data-type="taskItem"]')]
    const itemsB = [...docB.querySelectorAll('[data-type="taskItem"]')]

    const totalA = itemsA.length || 1
    const totalB = itemsB.length || 1

    const completedA = itemsA.filter((item) => item.getAttribute('data-checked') === 'true').length
    const completedB = itemsB.filter((item) => item.getAttribute('data-checked') === 'true').length

    const ratioA = completedA / totalA
    const ratioB = completedB / totalB

    const dateA = getTimestampInSeconds(a.createdAt)
    const dateB = getTimestampInSeconds(b.createdAt)
    switch (sortBy) {
      case 'completed':
        if (ratioA === ratioB) return dateB - dateA
        return ratioB - ratioA
      case 'completedInverse':
        if (ratioA === ratioB) return dateA - dateB
        return ratioA - ratioB
      case 'date': {
        return dateB - dateA
      }
      case 'dateInverse': {
        return dateA - dateB
      }
      default:
        return 0
    }
  })
}
