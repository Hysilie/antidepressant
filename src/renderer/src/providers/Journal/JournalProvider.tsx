import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { JournalContext } from './JournalContext'
import { Page } from './types'
import { useAuth } from '../Auth/useAuth'
import { db } from '../Auth/firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { toast } from 'react-toastify'

//TODO - Write a page
//TODO - Edit a page
//TODO - Delete a page

export const JournalProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const userId = currentUser?.uid
  const [pages, setPages] = useState<Page[]>([])

  /**
   * Fetch journal data from userID
   */
  useEffect(() => {
    const fetchJournalData = async (): Promise<void> => {
      if (!userId) {
        return
      }

      try {
        const journalRef = collection(db, 'Users', userId, 'journal')
        const querySnapshot = await getDocs(journalRef)
        const pagesData: Page[] = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            date: data.date.toDate?.() || new Date(),
            tag: data.tag,
            isLock: data.isLock
          }
        })

        setPages(pagesData)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message, { position: 'bottom-center' })
        } else {
          toast.error('An unknown error occurred', { position: 'bottom-center' })
        }
      }
    }

    fetchJournalData()
  }, [currentUser?.uid, userId])

  return <JournalContext.Provider value={{ pages }}>{children}</JournalContext.Provider>
}
