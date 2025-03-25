import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { JournalContext } from './JournalContext'
import { Page } from './types'

//TODO - Fetch the data with the user id
//TODO - Update Page type
//TODO - Delete FAKE_PAGES

const FAKE_PAGES = [
  {
    id: 1,
    content: 'First Page',
    date: new Date('2012-01-01')
  }
]

export const JournalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>([])

  useEffect(() => setPages(FAKE_PAGES), [pages])

  return <JournalContext.Provider value={{ pages }}>{children}</JournalContext.Provider>
}
