import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { PageContext } from './PageContext'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '@renderer/providers/Auth/firebase/firebase'
import { useAuth } from '@renderer/providers/Auth/useAuth'
import { useJournal } from '../useJournal'
import { isEmpty } from 'remeda'
import { useDelayedLoader } from '@renderer/utils/useDelayedLoader'

export const PageProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const { pages, refreshPages } = useJournal()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const { start, stop } = useDelayedLoader(setLoading)

  const userId = currentUser?.uid
  const [pageId] = useState(() => params.id ?? uuidv4())

  const localKey = `draft-page-${pageId}`

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<Date | undefined>(undefined)

  /**
   * Update page content
   */
  useEffect(() => {
    const existingPage = pages.find((p) => p.id === pageId)
    start()
    if (existingPage) {
      setTitle(existingPage.title)
      setContent(existingPage.content)
      setUpdatedAt(
        existingPage.updatedAt instanceof Date
          ? existingPage.updatedAt
          : (existingPage.updatedAt as unknown as Timestamp)?.toDate()
      )
    }
    stop()
  }, [pageId, pages, start, stop])

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

  const storeImage = async (imageId: string, base64: string): Promise<void> => {
    try {
      localStorage.setItem(`image-${imageId}`, base64)

      const docRef = doc(db, 'images', pageId)
      await setDoc(
        docRef,
        {
          [imageId]: base64,
          owner: userId
        },
        { merge: true }
      )
    } catch (error) {
      console.error('Error storing image:', error)
    }
  }

  /**
   * Retrieves image data by its ID and associated page ID.
   *
   * This function first attempts to fetch the image data from the browser's local storage.
   * If the data is not found locally, it queries a Firestore document for the image data.
   * If the data is successfully retrieved from Firestore, it is cached in local storage
   * for future use.
   *
   * @param imageId - The unique identifier of the image.
   * @param pageId - The unique identifier of the page associated with the image.
   * @returns A promise that resolves to the image data as a string if found, or `undefined` if not found.
   */
  const getImageData = async (imageId: string, pageId: string): Promise<string | undefined> => {
    try {
      const fromLocal = localStorage.getItem(`image-${imageId}`)
      if (fromLocal) {
        return fromLocal
      }

      const docRef = await getDoc(doc(db, 'images', pageId))
      const data = docRef.data()?.[imageId]
      if (data) {
        localStorage.setItem(`image-${imageId}`, data)
        return data
      }

      return undefined
    } catch (error) {
      console.error(`Error retrieving image data for ${imageId}:`, error)
      return undefined
    }
  }

  return (
    <PageContext.Provider
      value={{
        pageId,
        updatedAt,
        title,
        content,
        update,
        save,
        remove,
        isSaved,
        storeImage,
        getImageData,
        loading
      }}
    >
      {children}
    </PageContext.Provider>
  )
}
