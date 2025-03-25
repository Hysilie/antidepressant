import PreviousButton from '@renderer/components/PreviousButton'
import { useNavigate } from 'react-router'

const JournalScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const navigateToNewNote = (): void | Promise<void> => navigate('/journal/edit')
  const navigateToEditNote = (id: string): void | Promise<void> => navigate(`/journal/edit/${id}`)

  return (
    <div>
      <div className="flex gap">
        <PreviousButton />
        JournalScreen
      </div>
      <button onClick={() => navigateToEditNote('1')}>Edit a note </button>
      <button onClick={navigateToNewNote}>New note </button>
    </div>
  )
}

export default JournalScreen
