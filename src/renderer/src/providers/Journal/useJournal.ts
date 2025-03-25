import { useContext } from 'react'
import { JournalContext } from './JournalContext'
import { isEmpty } from 'remeda'
import { JournalContextData } from './types'

export const useJournal = (): JournalContextData => {
  const context = useContext(JournalContext)

  if (isEmpty(context)) {
    throw new Error('useJournal must be used withing a JournalProvider')
  }
  return context
}
