import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useTodo } from '../useTodo'
import { TaskContext } from './TaskContext'
import { useAuth } from '@renderer/providers/Auth/useAuth'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { deleteDoc, doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '@renderer/providers/Auth/firebase/firebase'
import { taskList } from '@renderer/features/Journal/constants'
import { isEmpty } from 'remeda'
import { useDelayedLoader } from '@renderer/utils/useDelayedLoader'

export const TaskProvider: FC<PropsWithChildren> = ({ children }) => {
  const { todoList: todoListArr, refreshTodos } = useTodo()
  const { currentUser } = useAuth()

  const params = useParams()
  const userId = currentUser?.uid
  const [todolistId] = useState(() => params.id ?? uuidv4())
  const localKey = `draft-todolist-${todolistId}`

  const [title, setTitle] = useState('')
  const [todos, setTodos] = useState(taskList)
  const [updatedAt, setUpdatedAt] = useState<Date | undefined>(undefined)
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const { start, stop } = useDelayedLoader(setLoading)

  /*
   * Upate todolist
   */
  useEffect(() => {
    const existingTodolist = todoListArr.find((t) => t.id === todolistId)

    start()
    if (!existingTodolist) {
      stop()
      return
    }
    if (existingTodolist) {
      setTitle(existingTodolist.title)
      setTodos(existingTodolist.todos)
      setUpdatedAt(
        existingTodolist.updatedAt instanceof Date
          ? existingTodolist.updatedAt
          : (existingTodolist.updatedAt as unknown as Timestamp)?.toDate()
      )
    }
    stop()
  }, [start, stop, todoListArr, todolistId])

  useEffect(() => {
    localStorage.setItem(localKey, JSON.stringify({ title, todos, lastModified: Date.now() }))
  }, [localKey, title, todos])

  const update = (fields: Partial<{ title: string; todos: string }>): void => {
    if (fields.title !== undefined) setTitle(fields.title)
    if (fields.todos !== undefined) setTodos(fields.todos)
  }

  /**
   * Saves the current todolist to the database.
   */
  const save = async (): Promise<void> => {
    if (!userId) {
      console.error('User ID is undefined. Cannot save the document.')
      return
    }

    const docRef = doc(db, 'Users', userId, 'todolist', todolistId)

    const existingDoc = todoListArr.find((p) => p.id === todolistId)
    const createdAt = existingDoc?.createdAt || serverTimestamp()

    await setDoc(docRef, {
      title: isEmpty(title) ? new Date().toLocaleDateString() : title,
      todos,
      createdAt,
      updatedAt: serverTimestamp()
    })

    if (navigator.onLine) {
      localStorage.removeItem(localKey)
    }
    setIsSaved(true)
    refreshTodos()
  }

  /**
   * Remove the current todolist to the database.
   */
  const remove = async (): Promise<void> => {
    if (!userId) {
      console.error('User ID is undefined. Cannot save the document.')
      return
    }

    const docRef = doc(db, 'Users', userId, 'todolist', todolistId)
    await deleteDoc(docRef)
    refreshTodos()
  }

  return (
    <TaskContext.Provider
      value={{ updatedAt, title, todos, update, isSaved, save, remove, loading, todolistId }}
    >
      {children}
    </TaskContext.Provider>
  )
}
