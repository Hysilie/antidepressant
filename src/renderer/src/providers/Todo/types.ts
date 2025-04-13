export interface TodoList {
  id: string
  title: string
  todos: string
  userid?: number
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  updatedAt?: {
    seconds: number
    nanoseconds: number
  }
}

export interface TodosContextData {
  todoList: TodoList[]
  refreshTodos: () => void
  loading: boolean
  pinATodo: (id: string) => void
  pinnedTodo: TodoList | undefined
}
