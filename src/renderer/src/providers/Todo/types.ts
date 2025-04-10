export interface TodoList {
  id: string
  title: string
  todos: string
  userid?: number
  createdAt: Date
  updatedAt?: Date
}

export interface TodosContextData {
  todoList: TodoList[]
  refreshTodos: () => void
  loading: boolean
}
