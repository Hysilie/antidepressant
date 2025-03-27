export interface PageContextData {
  title: string
  content: string
  update: (fields: Partial<{ title: string; content: string }>) => void
  save: () => Promise<void>
  remove: () => Promise<void>
  isSaved: boolean
}
