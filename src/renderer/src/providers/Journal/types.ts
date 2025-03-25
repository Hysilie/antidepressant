export interface JournalContextData {
  pages: Page[]
}

export interface Page {
  id: number
  content: string
  date: Date
}
