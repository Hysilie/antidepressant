import PreviousButton from '@renderer/components/PreviousButton'
import { useParams } from 'react-router'

const JournalEditor = (): JSX.Element => {
  const { id } = useParams()
  const isEdit = id
  return (
    <div>
      <PreviousButton />
      {isEdit ? <div>Journal Note id : {id}</div> : <div>New Note</div>}
    </div>
  )
}

export default JournalEditor
