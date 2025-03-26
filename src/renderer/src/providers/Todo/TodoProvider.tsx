import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { TodoList } from './types'
import { TodosContext } from './TodoContext'
import { useAuth } from '../Auth/useAuth'
import { collection, getDocs } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db } from '../Auth/firebase/firebase'

//TODO - Write a todolist
//TODO - Edit a todolist
//TODO - Delete a todolist

export const TodoProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const userId = currentUser?.uid
  const [todoList, setTodoList] = useState<TodoList[]>([])

  /**
   * Fetch todolist data from userID
   */
  useEffect(() => {
    const fetchTodolistData = async (): Promise<void> => {
      if (!userId) {
        return
      }

      try {
        const todolistRef = collection(db, 'Users', userId, 'todolist')
        const querySnapshot = await getDocs(todolistRef)
        const todolistData: TodoList[] = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title,
            date: data.date.toDate?.() || new Date(),
            todos: data.todos
          }
        })

        setTodoList(todolistData)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message, { position: 'bottom-center' })
        } else {
          toast.error('An unknown error occurred', { position: 'bottom-center' })
        }
      }
    }

    fetchTodolistData()
  }, [currentUser?.uid, userId])

  return <TodosContext.Provider value={{ todoList }}>{children}</TodosContext.Provider>
}
