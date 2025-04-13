import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { JournalContext } from './JournalContext'
import { Page } from './types'
import { useAuth } from '../Auth/useAuth'
import { db } from '../Auth/firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useDelayedLoader } from '@renderer/utils/useDelayedLoader'

export const JournalProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const userId = currentUser?.uid
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(false)
  const { start, stop } = useDelayedLoader(setLoading, 300)

  /**
   * Fetch journal data from userID
   */
  const fetchJournalData = useCallback(async (): Promise<void> => {
    if (!userId) {
      return
    }
    start()

    try {
      const journalRef = collection(db, 'Users', userId, 'journal')
      const querySnapshot = await getDocs(journalRef)
      const pagesData: Page[] = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          createdAt: data.createdAt || new Date(),
          tag: data.tag,
          isLock: data.isLock ?? false,
          updatedAt: data.updatedAt || new Date()
        }
      })

      setPages(pagesData)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { position: 'bottom-center' })
      } else {
        toast.error('An unknown error occurred', { position: 'bottom-center' })
      }
    } finally {
      stop()
      setLoading(false)
    }
  }, [start, stop, userId])

  useEffect(() => {
    fetchJournalData()
  }, [fetchJournalData, userId])

  return (
    <JournalContext.Provider value={{ pages, refreshPages: fetchJournalData, loading }}>
      {children}
    </JournalContext.Provider>
  )
}
