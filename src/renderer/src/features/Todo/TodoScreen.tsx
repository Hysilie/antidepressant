import { useTodo } from '@renderer/providers/Todo/useTodo'
import { useNetworkStatus } from '@renderer/providers/utils/useNetworkStatus'
import { routes } from '@renderer/utils/Routes/routes'
import { useNavigate } from 'react-router'

const TodoScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const isOnline = useNetworkStatus()

  const navigateToEditTodo = (id?: string): void | Promise<void> => navigate(routes.todoEdit(id))
  const { todoList } = useTodo()

  return (
    <div>
      <div className="flex gap">
        <button onClick={() => navigate(routes.home)}>back </button>
        Todo Screen
      </div>

      {todoList.map((t, index) => (
        <button disabled={!isOnline} key={index} onClick={() => navigateToEditTodo(t.id)}>
          {t.title}
        </button>
      ))}

      <button onClick={() => navigateToEditTodo()}>New Todo </button>
    </div>
  )
}

export default TodoScreen
