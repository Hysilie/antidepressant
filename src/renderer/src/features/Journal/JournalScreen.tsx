import { useJournal } from '@renderer/providers/Journal/useJournal'
import { useNetworkStatus } from '@renderer/providers/utils/useNetworkStatus'
import { routes } from '@renderer/utils/Routes/routes'
import { useNavigate } from 'react-router'

const JournalScreen = (): JSX.Element => {
  const { pages } = useJournal()
  const isOnline = useNetworkStatus()

  const navigate = useNavigate()
  const navigateToEditNote = (id?: string): void | Promise<void> => navigate(routes.journalEdit(id))

  return (
    <div>
      <button onClick={() => navigate(routes.home)}> back </button>

      <div className="flex gap">JournalScreen</div>
      {pages.map((p, index) => (
        <button disabled={!isOnline} key={index} onClick={() => navigateToEditNote(p.id)}>
          {p.title}
        </button>
      ))}
      <button onClick={() => navigateToEditNote()}>Create a note </button>
    </div>
  )
}

export default JournalScreen
