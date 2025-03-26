export interface Todo {
  id: string
  todo: string
  isDone: boolean
}

export interface TodoList {
  id: string
  title: string
  date: Date
  todos: Todo[]
  userid?: number
}

export interface TodosContextData {
  todoList: TodoList[]
}
