import PreviousButton from '@renderer/components/PreviousButton'
import { useJournal } from '@renderer/providers/Journal/useJournal'
import { useNavigate } from 'react-router'

const JournalScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const navigateToNewNote = (): void | Promise<void> => navigate('/journal/edit')
  const navigateToEditNote = (id: string): void | Promise<void> => navigate(`/journal/edit/${id}`)

  const { pages } = useJournal()
  return (
    <div>
      <div className="flex gap">
        <PreviousButton />
        JournalScreen
      </div>
      <div>{pages[0]?.title}</div>
      <button onClick={() => navigateToEditNote('1')}>Edit a note </button>
      <button onClick={navigateToNewNote}>New note </button>
    </div>
  )
}

export default JournalScreen
