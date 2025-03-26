export interface JournalContextData {
  pages: Page[]
}

export interface Page {
  id: string
  title: string
  content: string
  date: Date
  tag?: string
  isLock?: boolean
  userId?: string
}
