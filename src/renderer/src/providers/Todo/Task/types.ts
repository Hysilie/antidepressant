export interface TaskContextData {
  todos: string
  title: string
  updatedAt: Date | undefined
  update: (fields: Partial<{ title: string; todos: string }>) => void
  save: () => void
  remove: () => void
  isSaved: boolean
}
