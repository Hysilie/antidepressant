export interface Todo {
  id: number
  todo: string
  isDone: boolean
}

export interface TodoList {
  id: number
  date: Date
  todos: Todo[]
}

export interface TodosContextData {
  todoList: TodoList[]
}
