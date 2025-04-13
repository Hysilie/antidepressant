import { useContext } from 'react'
import { isEmpty } from 'remeda'
import { PageContextData } from './type'
import { PageContext } from './PageContext'

export const usePage = (): PageContextData => {
  const context = useContext(PageContext)

  if (isEmpty(context)) {
    throw new Error('usePage must be used within an PageProvider')
  }
  return context
}
