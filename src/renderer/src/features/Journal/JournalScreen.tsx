import { useJournal } from '@renderer/providers/Journal/useJournal'
import { useLock } from '@renderer/providers/Preferences/Lock/useLock'
import { useNetworkStatus } from '@renderer/providers/utils/useNetworkStatus'
import { routes } from '@renderer/utils/Routes/routes'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const JournalScreen = (): JSX.Element => {
  const { pages } = useJournal()
  const { isScreenLocked, checkCode } = useLock()
  const isOnline = useNetworkStatus()
  const [code, setCode] = useState('')

  const navigate = useNavigate()
  const navigateToEditNote = (id?: string): void | Promise<void> => navigate(routes.journalEdit(id))

  return isScreenLocked ? (
    <>
      <input
        placeholder="code lock"
        onChange={(e) => {
          e.preventDefault()
          setCode(e.target.value)
        }}
      />{' '}
      <button onClick={() => checkCode(parseInt(code, 10), true)}>Submit</button>
    </>
  ) : (
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
