import PreviousButton from '@renderer/components/PreviousButton'
import { useParams } from 'react-router'

const TodoEditor = (): JSX.Element => {
  const { id } = useParams()
  const isEdit = id
  return (
    <div>
      <PreviousButton />
      {isEdit ? <div> Todo id : {id}</div> : <div>New Todo</div>}
    </div>
  )
}

export default TodoEditor
