import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { TodoList } from './types'
import { TodosContext } from './TodoContext'

//TODO - Fetch the data with the user id
//TODO - Update Todo type
//TODO - Delete FAKE_TODO

const FAKE_TODOSLIST = [
  {
    id: 1,
    date: new Date('2012-01-01'),
    todos: [
      {
        id: 1,
        todo: 'task 1',
        isDone: true
      },
      {
        id: 2,
        todo: 'task 1',
        isDone: false
      }
    ]
  }
]

export const TodoProvider: FC<PropsWithChildren> = ({ children }) => {
  const [todoList, setTodoList] = useState<TodoList[]>([])

  useEffect(() => setTodoList(FAKE_TODOSLIST), [todoList])

  return <TodosContext.Provider value={{ todoList }}>{children}</TodosContext.Provider>
}
