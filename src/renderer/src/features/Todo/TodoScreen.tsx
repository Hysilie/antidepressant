import PreviousButton from '@renderer/components/PreviousButton'
import { useTodo } from '@renderer/providers/Todo/useTodo'
import { useNavigate } from 'react-router'

const TodoScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const navigateToNewTodo = (): void | Promise<void> => navigate('/todo/edit')
  const navigateToEditTodo = (id: string): void | Promise<void> => navigate(`/todo/edit/${id}`)
  const { todoList } = useTodo()
  return (
    <div>
      <div className="flex gap">
        <PreviousButton />
        Todo Screen
      </div>
      <div>{todoList[0]?.title}</div>
      <button onClick={() => navigateToEditTodo('1')}>Edit Todo id : 1</button>
      <button onClick={navigateToNewTodo}>New Todo </button>
    </div>
  )
}

export default TodoScreen
