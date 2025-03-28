import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { PageContext } from './PageContext'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router'
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '@renderer/providers/Auth/firebase/firebase'
import { useAuth } from '@renderer/providers/Auth/useAuth'
import { useJournal } from '../useJournal'
import { isEmpty } from 'remeda'

export const PageProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const { pages, refreshPages } = useJournal()
  const params = useParams()

  const userId = currentUser?.uid
  const [pageId] = useState(() => params.id ?? uuidv4())

  const localKey = `draft-page-${pageId}`

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  /**
   * Update page content
   */
  useEffect(() => {
    const existingPage = pages.find((p) => p.id === pageId)
    if (!existingPage) {
      return
    }
    if (existingPage) {
      setTitle(existingPage.title)
      setContent(existingPage.content)
    }
  }, [pageId, pages])

  /**
   * Save the current page state to localStorage to minimize Firestore writes
   * and ensure offline persistence.
   */
  useEffect(() => {
    localStorage.setItem(localKey, JSON.stringify({ title, content, lastModified: Date.now() }))
  }, [title, content, localKey])

  /**
   * Updates the journal page state with the provided fields.
   *
   * @param fields - An object containing the fields to update.
   * - `title` (optional): The new title of the journal page.
   * - `content` (optional): The new content of the journal page.
   */
  const update = (fields: Partial<{ title: string; content: string }>): void => {
    if (fields.title !== undefined) setTitle(fields.title)
    if (fields.content !== undefined) setContent(fields.content)
  }

  /**
   * Saves the current journal page to the database.
   */
  const save = async (): Promise<void> => {
    if (!userId) {
      console.error('User ID is undefined. Cannot save the document.')
      return
    }

    const docRef = doc(db, 'Users', userId, 'journal', pageId)

    const existingDoc = pages.find((p) => p.id === pageId)
    const createdAt = existingDoc?.createdAt || serverTimestamp()

    await setDoc(docRef, {
      title: isEmpty(title) ? new Date().toLocaleDateString() : title,
      content,
      createdAt,
      updatedAt: serverTimestamp()
    })

    if (navigator.onLine) {
      localStorage.removeItem(localKey)
    }
    setIsSaved(true)
    refreshPages()
  }

  /**
   * Remove the current journal page to the database.
   */
  const remove = async (): Promise<void> => {
    if (!userId) {
      console.error('User ID is undefined. Cannot save the document.')
      return
    }

    const docRef = doc(db, 'Users', userId, 'journal', pageId)
    await deleteDoc(docRef)
    refreshPages()
  }

  return (
    <PageContext.Provider value={{ title, content, update, save, remove, isSaved }}>
      {children}
    </PageContext.Provider>
  )
}
