import { useAuth } from '@renderer/providers/Auth/useAuth'
import { routes } from '@renderer/utils/Routes/routes'
import { Link } from 'react-router'

const HomeScreen = (): JSX.Element => {
  const { preferences, todo, player, journal } = routes
  const { logout } = useAuth()
  console.log('👋 Vite renderer is running')

  return (
    <div>
      Home
      <ul>
        <li>
          <Link to={preferences}>Preferences Screen</Link>
        </li>
        <li>
          <Link to={todo}>Todo Screen</Link>
        </li>
        <li>
          <Link to={player}>PlayerScreen Screen</Link>
        </li>
        <li>
          <Link to={journal}>Journal Screen</Link>
        </li>
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
    </div>
  )
}

export default HomeScreen
