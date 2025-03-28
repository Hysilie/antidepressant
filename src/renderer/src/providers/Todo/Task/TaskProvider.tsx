import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useTodo } from '../useTodo'
import { TaskContext } from './TaskContext'
import { useAuth } from '@renderer/providers/Auth/useAuth'
import { useParams } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '@renderer/providers/Auth/firebase/firebase'
import { taskList } from '@renderer/features/Journal/constants'
import { isEmpty } from 'remeda'

export const TaskProvider: FC<PropsWithChildren> = ({ children }) => {
  const { todoList: todoListArr, refreshTodos } = useTodo()
  const { currentUser } = useAuth()

  const params = useParams()
  const userId = currentUser?.uid
  const [todolistId] = useState(() => params.id ?? uuidv4())
  const localKey = `draft-todolist-${todolistId}`

  const [title, setTitle] = useState('')
  const [todos, setTodos] = useState(taskList)
  const [isSaved, setIsSaved] = useState(false)

  /*
   * Upate todolist
   */
  useEffect(() => {
    const existingTodolist = todoListArr.find((t) => t.id === todolistId)

    if (!existingTodolist) {
      return
    }
    if (existingTodolist) {
      setTitle(existingTodolist.title)
      setTodos(existingTodolist.todos)
    }
  }, [todoListArr, todolistId])

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
    <TaskContext.Provider value={{ title, todos, update, isSaved, save, remove }}>
      {children}
    </TaskContext.Provider>
  )
}
