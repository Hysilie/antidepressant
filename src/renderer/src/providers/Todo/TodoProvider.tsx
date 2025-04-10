import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { TodoList } from './types'
import { TodosContext } from './TodoContext'
import { useAuth } from '../Auth/useAuth'
import { collection, getDocs } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db } from '../Auth/firebase/firebase'
import { useDelayedLoader } from '@renderer/utils/useDelayedLoader'

export const TodoProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const userId = currentUser?.uid
  const [todoList, setTodoList] = useState<TodoList[]>([])
  const [loading, setLoading] = useState(false)
  const { start, stop } = useDelayedLoader(setLoading, 300)

  /**
   * Fetch todolist data from userID
   */
  const fetchTodolistData = useCallback(async (): Promise<void> => {
    if (!userId) {
      return
    }

    start()

    try {
      const todolistRef = collection(db, 'Users', userId, 'todolist')
      const querySnapshot = await getDocs(todolistRef)
      const todolistData: TodoList[] = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          todos: data.todos,
          createdAt: data.createdAt || new Date(),
          updatedAt: data.updatedAt || undefined
        }
      })

      setTodoList(todolistData)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { position: 'bottom-center' })
      } else {
        toast.error('An unknown error occurred', { position: 'bottom-center' })
      }
    } finally {
      stop()
    }
  }, [start, stop, userId])

  useEffect(() => {
    fetchTodolistData()
  }, [fetchTodolistData, userId])

  return (
    <TodosContext.Provider value={{ todoList, refreshTodos: fetchTodolistData, loading }}>
      {children}
    </TodosContext.Provider>
  )
}
