import { useContext } from 'react'
import { isEmpty } from 'remeda'
import { LockDataContext } from './types'
import { LockContext } from './LockContext'

export const useLock = (): LockDataContext => {
  const context = useContext(LockContext)

  if (isEmpty(context)) {
    throw new Error('useLock must be used within a Lock Provider')
  }
  return context
}
