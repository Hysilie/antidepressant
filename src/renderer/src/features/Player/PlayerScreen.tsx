import { usePlayer } from '@renderer/providers/Player/usePlayer'
import { routes } from '@renderer/utils/Routes/routes'
import { useNavigate } from 'react-router'

const PlayerScreen = (): JSX.Element => {
  const { redirectToSpotifyLogin, isConnected, username } = usePlayer()
  const navigate = useNavigate()

  return (
    <div>
      <div>
        <button onClick={() => navigate(routes.home)}>back </button>
        PlayerScreen
      </div>
      <button onClick={redirectToSpotifyLogin}>Connect To Spotify</button>
      {isConnected ? <p>✅ Connecté à Spotify !</p> : 'not connected'}

      {username ? <p>Hello {username}</p> : 'Unknown'}
    </div>
  )
}

export default PlayerScreen
