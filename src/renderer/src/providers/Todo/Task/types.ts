export interface TaskContextData {
  todos: string
  title: string
  update: (fields: Partial<{ title: string; todos: string }>) => void
  save: () => void
  remove: () => void
  isSaved: boolean
}
