import { usePlayer } from '@renderer/providers/Player/usePlayer'
import { routes } from '@renderer/utils/Routes/routes'
import { useNavigate } from 'react-router'

const PlayerScreen = (): JSX.Element => {
  const { next, previous, trackName, isPaused, openFolder, togglePlayPause } = usePlayer()
  const navigate = useNavigate()

  return (
    <div>
      <div>
        <button onClick={() => navigate(routes.home)}>back </button>
        PlayerScreen
      </div>
      <div>
        <p>{trackName}</p>
        <button onClick={previous}>⏮️</button>
        <button onClick={togglePlayPause}>{isPaused ? '▶️' : '⏸️'}</button>
        <button onClick={next}>⏭️</button>

        <button onClick={openFolder}>📁 Ouvrir un dossier</button>
      </div>
    </div>
  )
}

export default PlayerScreen
