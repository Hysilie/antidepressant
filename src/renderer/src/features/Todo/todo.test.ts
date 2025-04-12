import { TodoList } from '@renderer/providers/Todo/types'
import { JSDOM } from 'jsdom'
import { SortOption } from './TodoScreen'
const TODOLIST: TodoList[] = [
  {
    id: '4',
    title: 'Todo 4 - Before all',
    todos:
      '<ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Item 1</p></div></li></ul>',
    createdAt: {
      seconds: 1735708980,
      nanoseconds: 886000000
    },
    updatedAt: {
      seconds: 1735708980,
      nanoseconds: 886000000
    }
  },
  {
    id: '5',
    title: 'Todo 5 - After Todo 4 in time',
    todos:
      '<ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Item 1</p></div></li></ul>',
    createdAt: {
      seconds: 1744453397,
      nanoseconds: 943000000
    },
    updatedAt: {
      seconds: 1744453397,
      nanoseconds: 943000000
    }
  },
  {
    id: '3',
    title: 'Todo 3 - Partially Complete',
    todos:
      '<ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Item 1</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Item 2</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Item 3</p></div></li></ul>',
    createdAt: {
      seconds: 1744453344,
      nanoseconds: 135000000
    },
    updatedAt: {
      seconds: 1744453344,
      nanoseconds: 135000000
    }
  },
  {
    id: '1',
    title: 'Todo 1 - All Complete',
    todos:
      '<ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Item</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Item</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Item</p></div></li></ul>',
    createdAt: {
      seconds: 1744453312,
      nanoseconds: 418000000
    },
    updatedAt: {
      seconds: 1744453312,
      nanoseconds: 418000000
    }
  },
  {
    id: '2',
    title: 'Todo 2 - No Item',
    todos: '<p></p>',
    createdAt: {
      seconds: 1744453321,
      nanoseconds: 986000000
    },
    updatedAt: {
      seconds: 1744453321,
      nanoseconds: 986000000
    }
  }
] as const

const sortTodosTest = (todoList: TodoList[], sortBy: SortOption): TodoList[] => {
  const getTimestampInSeconds = (value: { seconds: number } | Date | null | undefined): number => {
    if (!value) return 0
    if ('seconds' in value) return value.seconds
    if (value instanceof Date) return Math.floor(value.getTime() / 1000)
    return 0
  }

  return [...todoList].sort((a, b) => {
    /* Here I use JSDOM instead of DOMParser because Jest uses Node and doesn't access to navigator API
     * const docA = new DOMParser().parseFromString(a.todos, 'text/html')
     * const docB = new DOMParser().parseFromString(b.todos, 'text/html')
     */
    const docA = new JSDOM(a.todos).window.document
    const docB = new JSDOM(b.todos).window.document

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

test('Expect the todoList to be returned', () =>
  expect(sortTodosTest(TODOLIST, 'date')).toBeDefined())

test('Expect the todoList to remain unchanged when sorted by an invalid option', () => {
  const sortedTodos = sortTodosTest(TODOLIST, 'invalidOption' as never)
  expect(sortedTodos).toEqual(TODOLIST)
})

test('Expect the todoList to prioritize todos with the least completion (id: 2 > 3 > 4 > 1 > 5) when sorted by completedInverse', () => {
  const sortedTodos = sortTodosTest(TODOLIST, 'completedInverse')
  expect(sortedTodos[0].id).toBe('2')
  expect(sortedTodos[1].id).toBe('3')
  expect(sortedTodos[2].id).toBe('4')
  expect(sortedTodos[3].id).toBe('1')
  expect(sortedTodos[4].id).toBe('5')
})

test('Expect the todoList to prioritize todos with the highest completion (id: 5 > 1 > 4 > 3 > 2)', () => {
  const sortedTodos = sortTodosTest(TODOLIST, 'completed')
  expect(sortedTodos[0].id).toBe('5')
  expect(sortedTodos[1].id).toBe('1')
  expect(sortedTodos[2].id).toBe('4')
  expect(sortedTodos[3].id).toBe('3')
  expect(sortedTodos[4].id).toBe('2')
})

test('Expect the todoList to prioritize todos by oldest creation (id: 4) when sorted by dateInverse', () => {
  const sortedTodos = sortTodosTest(TODOLIST, 'dateInverse')
  expect(sortedTodos[0].id).toBe('4')
  expect(sortedTodos[1].id).toBe('1')
  expect(sortedTodos[2].id).toBe('2')
  expect(sortedTodos[3].id).toBe('3')
  expect(sortedTodos[4].id).toBe('5')
})

test('Expect the todoList to prioritize todos by newest (id: 5) when sorted by date', () => {
  const sortedTodos = sortTodosTest(TODOLIST, 'date')
  expect(sortedTodos[0].id).toBe('5')
  expect(sortedTodos[1].id).toBe('3')
  expect(sortedTodos[2].id).toBe('2')
  expect(sortedTodos[3].id).toBe('1')
  expect(sortedTodos[4].id).toBe('4')
})
