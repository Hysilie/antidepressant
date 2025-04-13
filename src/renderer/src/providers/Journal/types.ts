export interface JournalContextData {
  pages: Page[]
  refreshPages: () => void
  loading: boolean
}

export interface Page {
  id: string
  title: string
  content: string
  createdAt: Date
  tag?: string
  isLock?: boolean
  userId?: string
  updatedAt?: Date
  isDraft?: boolean
}
